import { createClient } from "./supabase/server";
import type { Lang } from "./lang";

// Translates dynamic Supabase content (job descriptions, blog posts, etc.)
// on demand and caches the result in the `translations_cache` table, so the
// translation API is only ever called ONCE per field per item — every later
// Hindi view of that job/blog is a plain Supabase read.
//
// Uses the unofficial Google Translate web endpoint — free, no signup, no
// billing account, no API key. It's not an official supported API, so it
// could be rate-limited or changed without notice, but for translate-once-
// then-cache usage at this traffic level it's the most reliable free option
// available tonight. Swap translateChunk() below for an official provider
// later without touching anything else in this file.
//
// Requires a `translations_cache` table (see /supabase/translations_cache.sql).

type TranslateArgs = {
  sourceTable: string; // e.g. "jobs" | "blogs"
  sourceId: string; // the row's id or slug
  field: string; // e.g. "description" | "content_en"
  text: string; // the English source text
  lang: Lang;
};

// MyMemory-style APIs cap request size, but this endpoint handles longer
// text fine — we still chunk conservatively to keep URLs well under browser
// / server URL-length limits and to keep each translation call fast.
function chunkText(text: string, maxLen = 1400): string[] {
  const sentences = text.split(/(?<=[.!?।])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length > maxLen) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current = (current + " " + sentence).trim();
    }
  }

  if (current) chunks.push(current.trim());

  return chunks.length > 0 ? chunks : [text];
}

async function translateChunk(chunk: string): Promise<string> {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: "hi",
    dt: "t",
    q: chunk,
  });

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return chunk;
  }

  try {
    const json = await response.json();
    // Response shape: [[["translated part","source part",null,null,1], ...], ...]
    const segments = json?.[0];

    if (!Array.isArray(segments)) {
      return chunk;
    }

    const translated = segments
      .map((segment: unknown[]) => segment?.[0] ?? "")
      .join("");

    return translated || chunk;
  } catch {
    return chunk;
  }
}

export async function translateCached({
  sourceTable,
  sourceId,
  field,
  text,
  lang,
}: TranslateArgs): Promise<string> {
  // English is the source language — nothing to do.
  if (lang === "en" || !text) {
    return text;
  }

  const supabase = await createClient();

  const { data: cached } = await supabase
    .from("translations_cache")
    .select("translated_text")
    .eq("source_table", sourceTable)
    .eq("source_id", sourceId)
    .eq("field", field)
    .eq("lang", lang)
    .maybeSingle();

  if (cached?.translated_text) {
    return cached.translated_text;
  }

  try {
    const chunks = chunkText(text);
    const translatedChunks = await Promise.all(
      chunks.map((chunk) => translateChunk(chunk))
    );
    const translated = translatedChunks.join(" ");

    if (!translated) {
      return text;
    }

    // Best-effort write to cache; don't fail the page if this errors.
    await supabase.from("translations_cache").upsert(
      {
        source_table: sourceTable,
        source_id: sourceId,
        field,
        lang,
        translated_text: translated,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "source_table,source_id,field,lang" }
    );

    return translated;
  } catch {
    return text;
  }
}

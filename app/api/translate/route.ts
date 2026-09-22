import { NextRequest, NextResponse } from "next/server";
import { translateBatch } from "../../../lib/translate";
import type { Lang } from "../../../lib/lang";

// Lets CLIENT components (which can't import server-only code like
// lib/translate.ts directly) request cached translations over HTTP.
// Used by the jobs listing page, which fetches its data in the browser.
//
// Body: { lang: "hi", items: [{ sourceTable, sourceId, field, text }, ...] }
// Response: { translations: string[] } — same order as items.

type TranslateRequestItem = {
  sourceTable: string;
  sourceId: string;
  field: string;
  text: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lang: Lang = body?.lang === "hi" ? "hi" : "en";
    const items: TranslateRequestItem[] = Array.isArray(body?.items)
      ? body.items
      : [];

    if (items.length === 0) {
      return NextResponse.json({ translations: [] });
    }

    // Cap batch size defensively — the jobs page only ever sends one
    // page's worth of cards (max ~40 fields), this just guards against
    // an unexpectedly huge request.
    const safeItems = items.slice(0, 200);

    const translations = await translateBatch(
      safeItems.map((item) => ({
        sourceTable: item.sourceTable,
        sourceId: item.sourceId,
        field: item.field,
        text: item.text || "",
      })),
      lang
    );

    return NextResponse.json({ translations });
  } catch {
    return NextResponse.json(
      { translations: [], error: "translation_failed" },
      { status: 200 }
    );
  }
}

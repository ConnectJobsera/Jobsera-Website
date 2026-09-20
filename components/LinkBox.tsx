import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import { t, type Lang } from "../lib/lang";

type LinkBoxProps = {
  groupKey:
    | "home"
    | "job_middle"
    | "job_bottom"
    | "blog_middle_1"
    | "blog_middle_2"
    | "blog_bottom";
  lang?: Lang;
};

type ContentLink = {
  id: string;
  title: string;
  url: string;
  sort_order: number;
};

export default async function LinkBox({
  groupKey,
  lang = "en",
}: LinkBoxProps) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("content_links")
    .select("id, title, url, sort_order")
    .eq("group_key", groupKey)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const links = (data || []) as ContentLink[];

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="link-box" aria-label={t(lang, "related_links")}>
      <p className="link-box-heading">{t(lang, "related_links")}</p>

      <div className="link-box-list">
        {links.map((link) => {
          const isInternal = link.url.startsWith("/");

          return isInternal ? (
            <Link
              key={link.id}
              href={link.url}
              className="link-box-item"
            >
              {link.title}
            </Link>
          ) : (
            <a
              key={link.id}
              href={link.url}
              className="link-box-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}

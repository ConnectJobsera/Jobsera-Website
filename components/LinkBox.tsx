import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import { t, type Lang } from "../lib/lang";

type ContentLink = {
  id: string;
  title: string;
  url: string;
  sort_order: number;
};

type LinkBoxProps =
  | { groupKey: "home"; lang?: Lang; jobId?: never; blogId?: never; position?: never }
  | {
      jobId: string;
      position: "middle" | "bottom";
      lang?: Lang;
      groupKey?: never;
      blogId?: never;
    }
  | {
      blogId: string;
      position: "middle_1" | "middle_2" | "bottom";
      lang?: Lang;
      groupKey?: never;
      jobId?: never;
    };

export default async function LinkBox(props: LinkBoxProps) {
  const lang = props.lang ?? "en";
  const supabase = await createClient();

  let links: ContentLink[] = [];

  if ("groupKey" in props && props.groupKey) {
    const { data } = await supabase
      .from("content_links")
      .select("id, title, url, sort_order")
      .eq("group_key", props.groupKey)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    links = (data || []) as ContentLink[];
  } else if ("jobId" in props && props.jobId) {
    const { data } = await supabase
      .from("job_links")
      .select("id, title, url, sort_order")
      .eq("job_id", props.jobId)
      .eq("position", props.position)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    links = (data || []) as ContentLink[];
  } else if ("blogId" in props && props.blogId) {
    const { data } = await supabase
      .from("blog_links")
      .select("id, title, url, sort_order")
      .eq("blog_id", props.blogId)
      .eq("position", props.position)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    links = (data || []) as ContentLink[];
  }

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
            <Link key={link.id} href={link.url} className="link-box-item">
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

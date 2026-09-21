import Link from "next/link";
import { t, type Lang } from "../lib/lang";

type BlogCardProps = {
  category: string;
  title: string;
  description: string;
  slug: string;
  lang?: Lang;
};

export default function BlogCard({
  category,
  title,
  description,
  slug,
  lang = "en",
}: BlogCardProps) {
  return (
    <article className="card">
      <div className="card-content">
        <p className="eyebrow">{category}</p>

        <h2 className="card-title">{title}</h2>

        <p className="card-description">{description}</p>

        <Link href={`/blogs/${slug}`} className="article-link">
          {t(lang, "read_article_link")}
        </Link>
      </div>
    </article>
  );
}


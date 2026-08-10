import Link from "next/link";

type BlogCardProps = {
  category: string;
  title: string;
  description: string;
  slug: string;
};

export default function BlogCard({
  category,
  title,
  description,
  slug,
}: BlogCardProps) {
  return (
    <article className="card">
      <div className="card-content">
        <p className="eyebrow">{category}</p>

        <h2 className="card-title">{title}</h2>

        <p className="card-description">{description}</p>

        <Link
          href={`/blogs/${slug}`}
          className="article-link"
        >
          Read article →
        </Link>
      </div>
    </article>
  );
}

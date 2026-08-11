import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

type BlogArticle = {
  slug: string;
  category: string;
  title_en: string;
  description_en: string;
  content_en: string | null;
};

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select(
      "slug, category, title_en, description_en, content_en"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const article = data as BlogArticle | null;

  if (error || !article) {
    notFound();
  }

  const contentBlocks: string[] = article.content_en
    ? article.content_en
        .split(/\n\s*\n/)
        .map((block: string) => block.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="content-page">
      <div className="container">
        <Link href="/blogs" className="article-link">
          ← Back to Career Insights
        </Link>

        <div style={{ marginTop: "28px" }}>
          <p className="eyebrow">{article.category}</p>

          <h1>{article.title_en}</h1>

          <p className="page-intro">
            {article.description_en}
          </p>
        </div>

        <div>
          {contentBlocks.map((block: string, index: number) => {
            const lines: string[] = block
              .split("\n")
              .map((line: string) => line.trim())
              .filter(Boolean);

            const heading = lines[0];
            const paragraphs = lines.slice(1);

            return (
              <section
                className="content-section"
                key={`${article.slug}-${index}`}
              >
                <h2>{heading}</h2>

                {paragraphs.map(
                  (
                    paragraph: string,
                    paragraphIndex: number
                  ) => (
                    <p
                      key={`${article.slug}-${index}-${paragraphIndex}`}
                      style={{ marginTop: "10px" }}
                    >
                      {paragraph}
                    </p>
                  )
                )}
              </section>
            );
          })}
        </div>

        <div className="contact-card">
          <h2>Looking for opportunities?</h2>

          <p>
            Explore Jobsera's latest opportunities and take the
            next step in your career.
          </p>

          <Link
            href="/jobs"
            className="button button-primary"
            style={{ marginTop: "18px" }}
          >
            Explore Jobs
          </Link>
        </div>
      </div>
    </main>
  );
}

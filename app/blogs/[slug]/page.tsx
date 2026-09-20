import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "../../../lib/supabase/server";
import { getLang } from "../../../lib/get-lang";
import { t } from "../../../lib/lang";
import { translateCached } from "../../../lib/translate";
import LinkBox from "../../../components/LinkBox";

type BlogArticle = {
  slug: string;
  category: string;
  title_en: string;
  description_en: string;
  content_en: string | null;
  created_at: string | null;
};

type BlogDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = "https://www.thejobsera.com";

async function getArticle(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("slug, category, title_en, description_en, content_en, created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as BlogArticle;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const url = `${siteUrl}/blogs/${article.slug}`;
  const description = (article.description_en || "").slice(0, 160);

  return {
    title: article.title_en,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title_en,
      description,
      url,
      type: "article",
      ...(article.created_at ? { publishedTime: article.created_at } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title_en,
      description,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const [article, lang] = await Promise.all([getArticle(slug), getLang()]);

  if (!article) {
    notFound();
  }

  const data = article as BlogArticle;

  const contentBlocks: string[] = data.content_en
    ? data.content_en
        .split(/\n\s*\n/)
        .map((block: string) => block.trim())
        .filter(Boolean)
    : [];

  const [title, description] = await Promise.all([
    translateCached({ sourceTable: "blogs", sourceId: data.slug, field: "title", text: data.title_en, lang }),
    translateCached({ sourceTable: "blogs", sourceId: data.slug, field: "description", text: data.description_en, lang }),
  ]);

  const translatedBlocks = await Promise.all(
    contentBlocks.map(async (block, index) => {
      const lines: string[] = block
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean);

      const heading = lines[0];
      const paragraphs = lines.slice(1);

      const [translatedHeading, ...translatedParagraphs] = await Promise.all([
        translateCached({ sourceTable: "blogs", sourceId: data.slug, field: `block_${index}_heading`, text: heading, lang }),
        ...paragraphs.map((p, pIdx) =>
          translateCached({ sourceTable: "blogs", sourceId: data.slug, field: `block_${index}_para_${pIdx}`, text: p, lang })
        ),
      ]);

      return { heading: translatedHeading, paragraphs: translatedParagraphs };
    })
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title_en,
    description: data.description_en,
    ...(data.created_at ? { datePublished: data.created_at } : {}),
    author: { "@type": "Organization", name: "Jobsera" },
    publisher: { "@type": "Organization", name: "Jobsera" },
    mainEntityOfPage: `${siteUrl}/blogs/${data.slug}`,
  };

  return (
    <main className="content-page">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <Link href="/blogs" className="article-link">
          {t(lang, "back_to_insights")}
        </Link>

        <div style={{ marginTop: "28px" }}>
          <p className="eyebrow">{data.category}</p>
          <h1>{title}</h1>
          <p className="page-intro">{description}</p>
        </div>

        <div>
          {translatedBlocks.map((block, index) => (
            <div key={`${data.slug}-${index}`}>
              <section className="content-section">
                <h2>{block.heading}</h2>
                {block.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${data.slug}-${index}-${paragraphIndex}`}
                    style={{ marginTop: "10px" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </section>

              {/* Per spec: link box after paragraph 1 and after paragraph 2 */}
              {index === 0 && <LinkBox groupKey="blog_middle_1" lang={lang} />}
              {index === 1 && <LinkBox groupKey="blog_middle_2" lang={lang} />}
            </div>
          ))}
        </div>

        {/* Per spec: link box at the bottom of the article */}
        <LinkBox groupKey="blog_bottom" lang={lang} />

        <div className="contact-card">
          <h2>{t(lang, "looking_for_opportunities")}</h2>
          <p>
            Explore Jobsera&apos;s latest opportunities and take the next
            step in your career.
          </p>
          <Link
            href="/jobs"
            className="button button-primary"
            style={{ marginTop: "18px" }}
          >
            {t(lang, "explore_jobs")}
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import { createClient } from "../../lib/supabase/server";
import { getLang } from "../../lib/get-lang";
import { t } from "../../lib/lang";
import { runLimited, translateCached } from "../../lib/translate";

const BLOGS_PER_PAGE = 6;
const PAGINATION_NUMBER_COUNT = 5;

type BlogsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

export default async function BlogsPage({
  searchParams,
}: BlogsPageProps) {
  const params = await searchParams;
  const lang = await getLang();

  const search = (params.search || "").trim();
  const requestedPage = Number.parseInt(params.page || "1", 10);

  const supabase = await createClient();

  let query = supabase
    .from("blogs")
    .select("slug, category, title_en, description_en, created_at", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (search) {
    const safeSearch = search.replace(/[%_]/g, "\\$&");
    query = query.or(
      `title_en.ilike.%${safeSearch}%,description_en.ilike.%${safeSearch}%,category.ilike.%${safeSearch}%`
    );
  }

  const { count, error } = await query;

  const totalBlogs = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalBlogs / BLOGS_PER_PAGE));
  const currentPage = Math.min(Math.max(requestedPage || 1, 1), totalPages);

  const from = (currentPage - 1) * BLOGS_PER_PAGE;
  const to = from + BLOGS_PER_PAGE - 1;

  let articles: { slug: string; category: string; title_en: string; description_en: string; created_at: string }[] | null = null;

  if (!error && totalBlogs > 0) {
    let paginatedQuery = supabase
      .from("blogs")
      .select("slug, category, title_en, description_en, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      const safeSearch = search.replace(/[%_]/g, "\\$&");
      paginatedQuery = paginatedQuery.or(
        `title_en.ilike.%${safeSearch}%,description_en.ilike.%${safeSearch}%,category.ilike.%${safeSearch}%`
      );
    }

    const result = await paginatedQuery;
    articles = result.data;
  }

  // Translate each visible card's title/description. Cached per article, so
  // repeat views cost nothing after the first Hindi view of that page.
  // runLimited caps concurrent translation calls so a full page of cards
  // doesn't trip the free translation endpoint's rate limiting.
  async function translateArticles() {
    if (!articles) return null;

    const results: (typeof articles[number] & {
      title: string;
      description: string;
    })[] = new Array(articles.length) as any;

    await runLimited(articles, async (article, index) => {
      const [title, description] = await Promise.all([
        translateCached({ sourceTable: "blogs", sourceId: article.slug, field: "title", text: article.title_en, lang }),
        translateCached({ sourceTable: "blogs", sourceId: article.slug, field: "description", text: article.description_en, lang }),
      ]);
      results[index] = { ...article, title, description };
    });

    return results;
  }

  const resolvedArticles = await translateArticles();

  const visibleCount = Math.min(PAGINATION_NUMBER_COUNT, totalPages);
  let startPage = Math.max(1, currentPage - Math.floor(PAGINATION_NUMBER_COUNT / 2));
  const maxStart = Math.max(1, totalPages - visibleCount + 1);
  startPage = Math.min(startPage, maxStart);
  const pageNumbers = Array.from({ length: visibleCount }, (_, index) => startPage + index);

  function pageHref(page: number) {
    const queryParams = new URLSearchParams();
    if (search) queryParams.set("search", search);
    if (page > 1) queryParams.set("page", String(page));
    const queryString = queryParams.toString();
    return queryString ? `/blogs?${queryString}` : "/blogs";
  }

  return (
    <>
      <section className="content-page">
        <div className="container">
          <p className="eyebrow">CAREER INSIGHTS</p>
          <h1>{t(lang, "learn_prepare_grow")}</h1>
          <p className="page-intro">{t(lang, "blogs_page_description")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LATEST ARTICLES</p>
              <h2 className="section-title">{t(lang, "explore_career_resources")}</h2>
              <p className="section-description">{t(lang, "explore_career_resources_desc")}</p>
            </div>
          </div>

          <form method="GET" action="/blogs" className="blogs-search-form">
            <div className="blogs-search">
              <svg className="blogs-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
                <path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder={t(lang, "search_insights_placeholder")}
                aria-label={t(lang, "search_insights_placeholder")}
              />

              <button type="submit" className="button button-primary">
                {t(lang, "search_button")}
              </button>
            </div>
          </form>

          {error ? (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">{t(lang, "unable_to_load_articles")}</h3>
                <p className="card-description">{t(lang, "try_again_later")}</p>
              </div>
            </div>
          ) : resolvedArticles && resolvedArticles.length > 0 ? (
            <>
              {search && (
                <div className="blogs-results-heading">
                  <p>
                    {t(lang, "showing_results_for")} <strong>&quot;{search}&quot;</strong>
                  </p>
                </div>
              )}

              <div className="card-grid">
                {resolvedArticles.map((article) => (
                  <BlogCard
                    key={article.slug}
                    category={article.category}
                    title={article.title}
                    description={article.description}
                    slug={article.slug}
                    lang={lang}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="blogs-pagination" aria-label="Blog pagination">
                  <Link
                    href={pageHref(currentPage - 1)}
                    className={`pagination-button ${currentPage === 1 ? "pagination-disabled" : ""}`}
                    aria-disabled={currentPage === 1}
                  >
                    {t(lang, "previous_label")}
                  </Link>

                  <div className="pagination-numbers">
                    {pageNumbers.map((page) => (
                      <Link
                        key={page}
                        href={pageHref(page)}
                        className={`pagination-number ${currentPage === page ? "pagination-current" : ""}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={pageHref(currentPage + 1)}
                    className={`pagination-button ${currentPage === totalPages ? "pagination-disabled" : ""}`}
                    aria-disabled={currentPage === totalPages}
                  >
                    {t(lang, "next_label")}
                  </Link>
                </nav>
              )}
            </>
          ) : search ? (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">{t(lang, "no_articles_found_heading")}</h3>
                <p className="card-description">{t(lang, "try_different_keyword")}</p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">{t(lang, "no_articles_available_heading")}</h3>
                <p className="card-description">{t(lang, "new_resources_soon")}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">LOOKING FOR OPPORTUNITIES?</p>
              <h2>{t(lang, "find_next_opportunity")}</h2>
              <p>
                Explore Jobsera&apos;s latest job opportunities and take the next step in your career.
              </p>
            </div>

            <Link href="/jobs" className="button button-primary">
              {t(lang, "explore_jobs")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}



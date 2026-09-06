import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import { createClient } from "../../lib/supabase/server";

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

  const search = (params.search || "").trim();
  const requestedPage = Number.parseInt(params.page || "1", 10);

  const supabase = await createClient();

  let query = supabase
    .from("blogs")
    .select(
      "slug, category, title_en, description_en, created_at",
      { count: "exact" }
    )
    .eq("is_published", true)
    .order("created_at", {
      ascending: false,
    });

  if (search) {
    const safeSearch = search.replace(/[%_]/g, "\\$&");

    query = query.or(
      `title_en.ilike.%${safeSearch}%,description_en.ilike.%${safeSearch}%,category.ilike.%${safeSearch}%`
    );
  }

  const { count, error } = await query;

  const totalBlogs = count || 0;
  const totalPages = Math.max(
    1,
    Math.ceil(totalBlogs / BLOGS_PER_PAGE)
  );

  const currentPage = Math.min(
    Math.max(requestedPage || 1, 1),
    totalPages
  );

  const from = (currentPage - 1) * BLOGS_PER_PAGE;
  const to = from + BLOGS_PER_PAGE - 1;

  let articles = null;

  if (!error && totalBlogs > 0) {
    let paginatedQuery = supabase
      .from("blogs")
      .select(
        "slug, category, title_en, description_en, created_at"
      )
      .eq("is_published", true)
      .order("created_at", {
        ascending: false,
      })
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

  const visibleCount = Math.min(
    PAGINATION_NUMBER_COUNT,
    totalPages
  );

  let startPage = Math.max(
    1,
    currentPage - Math.floor(PAGINATION_NUMBER_COUNT / 2)
  );

  const maxStart = Math.max(
    1,
    totalPages - visibleCount + 1
  );

  startPage = Math.min(startPage, maxStart);

  const pageNumbers = Array.from(
    { length: visibleCount },
    (_, index) => startPage + index
  );

  function pageHref(page: number) {
    const queryParams = new URLSearchParams();

    if (search) {
      queryParams.set("search", search);
    }

    if (page > 1) {
      queryParams.set("page", String(page));
    }

    const queryString = queryParams.toString();

    return queryString
      ? `/blogs?${queryString}`
      : "/blogs";
  }

  return (
    <>
      <section className="content-page">
        <div className="container">
          <p className="eyebrow">CAREER INSIGHTS</p>

          <h1>Learn. Prepare. Grow.</h1>

          <p className="page-intro">
            Practical career information, job search guidance and useful
            insights to help you make better decisions about your career.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LATEST ARTICLES</p>

              <h2 className="section-title">
                Explore Career Resources
              </h2>

              <p className="section-description">
                Read useful guides and insights designed to help you prepare
                for your next opportunity.
              </p>
            </div>
          </div>

          <form
            method="GET"
            action="/blogs"
            className="blogs-search-form"
          >
            <div className="blogs-search">
              <svg
                className="blogs-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m16 16 5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search career insights..."
                aria-label="Search career insights"
              />

              <button
                type="submit"
                className="button button-primary"
              >
                Search
              </button>
            </div>
          </form>

          {error ? (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  Unable to load articles
                </h3>

                <p className="card-description">
                  Please try again later.
                </p>
              </div>
            </div>
          ) : articles && articles.length > 0 ? (
            <>
              {search && (
                <div className="blogs-results-heading">
                  <p>
                    Showing results for{" "}
                    <strong>"{search}"</strong>
                  </p>
                </div>
              )}

              <div className="card-grid">
                {articles.map((article) => (
                  <BlogCard
                    key={article.slug}
                    category={article.category}
                    title={article.title_en}
                    description={article.description_en}
                    slug={article.slug}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="blogs-pagination"
                  aria-label="Blog pagination"
                >
                  <Link
                    href={pageHref(currentPage - 1)}
                    className={`pagination-button ${
                      currentPage === 1
                        ? "pagination-disabled"
                        : ""
                    }`}
                    aria-disabled={currentPage === 1}
                  >
                    Previous
                  </Link>

                  <div className="pagination-numbers">
                    {pageNumbers.map((page) => (
                      <Link
                        key={page}
                        href={pageHref(page)}
                        className={`pagination-number ${
                          currentPage === page
                            ? "pagination-current"
                            : ""
                        }`}
                        aria-current={
                          currentPage === page
                            ? "page"
                            : undefined
                        }
                      >
                        {page}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={pageHref(currentPage + 1)}
                    className={`pagination-button ${
                      currentPage === totalPages
                        ? "pagination-disabled"
                        : ""
                    }`}
                    aria-disabled={currentPage === totalPages}
                  >
                    Next
                  </Link>
                </nav>
              )}
            </>
          ) : search ? (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  No articles found.
                </h3>

                <p className="card-description">
                  Try searching with a different keyword.
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  No articles available yet.
                </h3>

                <p className="card-description">
                  New career resources will appear here soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">
                LOOKING FOR OPPORTUNITIES?
              </p>

              <h2>Find your next opportunity.</h2>

              <p>
                Explore Jobsera's latest job opportunities and take
                the next step in your career.
              </p>
            </div>

            <Link
              href="/jobs"
              className="button button-primary"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

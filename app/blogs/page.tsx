import Link from "next/link";
import BlogCard from "../../components/BlogCard";
import { createClient } from "../../lib/supabase/server";

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("blogs")
    .select(
      "slug, category, title_en, description_en"
    )
    .eq("is_published", true)
    .order("created_at", {
      ascending: false,
    });

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

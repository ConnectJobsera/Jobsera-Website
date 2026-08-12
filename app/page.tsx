"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import HomeHighlight from "../components/HomeHighlight";
import { createClient } from "../lib/supabase/client";
const qualifications = [
  {
    label: "8th Pass",
    href: "/jobs?qualification=8th-pass",
  },
  {
    label: "10th Pass",
    href: "/jobs?qualification=10th-pass",
  },
  {
    label: "12th Pass",
    href: "/jobs?qualification=12th-pass",
  },
  {
    label: "Diploma",
    href: "/jobs?qualification=diploma",
  },
  {
    label: "Graduate",
    href: "/jobs?qualification=graduate",
  },
];

type HomeJob = {
  id: string;
  company: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  created_at: string;
};

type HomeArticle = {
  slug: string;
  category: string;
  title_en: string;
  description_en: string;
};

type HomeHighlightRow = {
  text: string;
  link: string;
};

const defaultHighlight: HomeHighlightRow = {
  text: "New opportunities are waiting for you — explore the latest jobs on Jobsera.",
  link: "/jobs",
};

function formatJobDate(dateString: string) {
  const date = new Date(dateString);
  const daysAgo = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysAgo <= 3) return "Recently added";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [notificationMessage, setNotificationMessage] =
    useState("");

  const [jobs, setJobs] = useState<HomeJob[]>([]);
  const [articles, setArticles] = useState<HomeArticle[]>([]);
  const [highlight, setHighlight] =
    useState<HomeHighlightRow>(defaultHighlight);

  useEffect(() => {
    const supabase = createClient();

    async function loadHomeData() {
      const [jobsResult, blogsResult, highlightsResult] =
        await Promise.all([
          supabase
            .from("jobs")
            .select("id, company, title, location, type, experience, created_at")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("blogs")
            .select("slug, category, title_en, description_en")
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("highlights")
            .select("text, link")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(1),
        ]);

      if (jobsResult.data) setJobs(jobsResult.data);
      if (blogsResult.data) setArticles(blogsResult.data);
      if (highlightsResult.data && highlightsResult.data.length > 0) {
        setHighlight(highlightsResult.data[0]);
      }
    }

    loadHomeData();
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    if (query) {
      window.location.href = `/jobs?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = "/jobs";
    }
  }
  function handleNotifications() {
    setNotificationMessage(
      "Notifications will be available soon."
    );
  }
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">
              YOUR CAREER STARTS HERE
            </p>
            <h1 className="hero-title">
              Stay informed.
              <br />
              <span>Find your next opportunity.</span>
            </h1>
            <p className="hero-description">
              Discover jobs, career information and useful resources
              designed to help you take your next step with confidence.
            </p>
            <div className="hero-actions">
              <Link
                href="/jobs"
                className="button button-primary"
              >
                Explore Jobs
              </Link>
              <Link
                href="/blogs"
                className="button button-secondary"
              >
                Career Insights
              </Link>
            </div>
            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "28px",
                maxWidth: "680px",
              }}
            >
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, companies or locations"
                aria-label="Search jobs, companies or locations"
                className="form-input"
                style={{
                  flex: "1 1 300px",
                  minHeight: "46px",
                  height: "46px",
                }}
              />
              <button
                type="submit"
                className="button button-primary"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* HIGHLIGHT */}
      <HomeHighlight
        text={highlight.text}
        href={highlight.link}
      />
      {/* QUALIFICATIONS */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                FIND YOUR OPPORTUNITY
              </p>
              <h2 className="section-title">
                Jobs by Qualification
              </h2>
              <p className="section-description">
                Choose your qualification to discover relevant
                opportunities.
              </p>
            </div>
          </div>
          <div className="qualification-grid">
            {qualifications.map((qualification) => (
              <Link
                key={qualification.href}
                href={qualification.href}
                className="qualification-card"
              >
                {qualification.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* LATEST JOBS */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                OPPORTUNITIES
              </p>
              <h2 className="section-title">
                Latest Jobs
              </h2>
              <p className="section-description">
                Discover recently added opportunities.
              </p>
            </div>
            <Link
              href="/jobs"
              className="button button-secondary"
            >
              View All Jobs
            </Link>
          </div>
          <div className="job-list">
            {jobs.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>
                No active jobs yet. Check back soon.
              </p>
            ) : (
              jobs.map((job) => (
                <article
                  className="job-item"
                  key={job.id}
                >
                  <div className="job-main">
                    <span className="job-company">
                      {job.company}
                    </span>
                    <h3 className="job-title">
                      {job.title}
                    </h3>
                    <div className="job-details">
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                  <div className="job-side">
                    <span className="job-date">
                      {formatJobDate(job.created_at)}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="job-link"
                    >
                      View Job →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
      {/* ARTICLES */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                CAREER INSIGHTS
              </p>
              <h2 className="section-title">
                Learn. Prepare. Grow.
              </h2>
              <p className="section-description">
                Useful information to help you make better
                career decisions.
              </p>
            </div>
            <Link
              href="/blogs"
              className="button button-secondary"
            >
              View All
            </Link>
          </div>
          <div className="card-grid">
            {articles.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>
                No published articles yet. Check back soon.
              </p>
            ) : (
              articles.map((article) => (
                <article
                  className="card"
                  key={article.slug}
                >
                  <div className="card-content">
                    <p className="eyebrow">
                      {article.category}
                    </p>
                    <h3 className="card-title">
                      {article.title_en}
                    </h3>
                    <p className="card-description">
                      {article.description_en}
                    </p>
                    <Link
                      href={`/blogs/${article.slug}`}
                      className="article-link"
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
      {/* NOTIFICATIONS */}
      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">
                STAY UPDATED
              </p>
              <h2>
                Don't miss what's next.
              </h2>
              <p>
                Enable Jobsera notifications and get updates
                about new opportunities and important content.
              </p>
              {notificationMessage && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                  role="status"
                >
                  {notificationMessage}
                </p>
              )}
            </div>
            <button
              type="button"
              className="button button-primary"
              onClick={handleNotifications}
            >
              Enable Notifications
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

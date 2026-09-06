"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import HomeHighlight from "../components/HomeHighlight";
import { createClient } from "../lib/supabase/client";

const qualifications = [
  {
    label: "10th Pass",
    shortLabel: "10th",
    href: "/jobs?qualification=10th-pass",
    icon: "10",
  },
  {
    label: "12th Pass",
    shortLabel: "12th",
    href: "/jobs?qualification=12th-pass",
    icon: "12",
  },
  {
    label: "Graduate",
    shortLabel: "Graduate",
    href: "/jobs?qualification=graduate",
    icon: "GR",
  },
  {
    label: "Post Graduate",
    shortLabel: "Post Graduate",
    href: "/jobs?qualification=post-graduate",
    icon: "PG",
  },
  {
    label: "Diploma",
    shortLabel: "Diploma",
    href: "/jobs?qualification=diploma",
    icon: "DP",
  },
  {
    label: "ITI",
    shortLabel: "ITI",
    href: "/jobs?qualification=iti",
    icon: "IT",
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
  text: "New opportunities added daily – Explore the latest jobs and take the next step in your career.",
  link: "/jobs",
};

function formatJobDate(dateString: string) {
  const date = new Date(dateString);

  const daysAgo = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysAgo <= 3) {
    return "Recently added";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

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
            .select(
              "id, company, title, location, type, experience, created_at"
            )
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

      if (jobsResult.data) {
        setJobs(jobsResult.data);
      }

      if (blogsResult.data) {
        setArticles(blogsResult.data);
      }

      if (highlightsResult.data && highlightsResult.data.length > 0) {
        setHighlight(highlightsResult.data[0]);
      }
    }

    loadHomeData();
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();
    const locationQuery = location.trim();

    const params = new URLSearchParams();

    if (query) {
      params.set("search", query);
    }

    if (locationQuery) {
      params.set("location", locationQuery);
    }

    const queryString = params.toString();

    window.location.href = queryString
      ? `/jobs?${queryString}`
      : "/jobs";
  }

  function handleNotifications() {
    setNotificationMessage(
      "Notifications will be available soon."
    );
  }

  return (
    <>
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="hero">
        <div className="hero-doodle hero-doodle-circle" aria-hidden="true" />
        <div className="hero-doodle hero-doodle-spark" aria-hidden="true">
          ✦
        </div>
        <div className="hero-doodle hero-doodle-star" aria-hidden="true">
          ★
        </div>
        <div className="hero-doodle hero-doodle-arrow" aria-hidden="true">
          ↗
        </div>

        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">YOUR CAREER STARTS HERE</p>

            <h1 className="hero-title">
              Find Opportunities.
              <br />
              Build <span>Your Future.</span>
            </h1>

            <p className="hero-description">
              Discover the right job opportunities and take the next
              step in your career with confidence.
            </p>

            <form
              className="hero-search"
              onSubmit={handleSearch}
              role="search"
            >
              <div className="hero-search-field">
                <svg
                  className="hero-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="m16 16 5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, keywords or company"
                  aria-label="Job title, keywords or company"
                />
              </div>

              <div className="hero-search-divider" aria-hidden="true" />

              <div className="hero-search-field">
                <svg
                  className="hero-location-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M20 10.5C20 15.5 12 21 12 21S4 15.5 4 10.5a8 8 0 1 1 16 0Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="10.5"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location"
                  aria-label="Job location"
                />
              </div>

              <button
                type="submit"
                className="hero-search-button"
              >
                Search Jobs
              </button>
            </form>

            <div className="hero-quick-links">
              <span>Popular:</span>

              <Link href="/jobs?qualification=10th-pass">
                10th Pass
              </Link>

              <Link href="/jobs?qualification=12th-pass">
                12th Pass
              </Link>

              <Link href="/jobs?qualification=graduate">
                Graduate
              </Link>

              <Link href="/jobs?qualification=diploma">
                Diploma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HIGHLIGHT
      ========================================================= */}
      <HomeHighlight
        text={highlight.text}
        href={highlight.link}
      />

      {/* =========================================================
          JOBS BY QUALIFICATION
      ========================================================= */}
      <section className="section qualification-section">
        <div className="container">
          <div className="qualification-heading">
            <p className="eyebrow">
              FIND YOUR OPPORTUNITY
            </p>

            <h2 className="section-title">
              Jobs By Qualification
            </h2>

            <p className="section-description">
              Find opportunities that match your education and
              experience.
            </p>
          </div>

          <div className="qualification-grid">
            {qualifications.map((qualification) => (
              <Link
                key={qualification.href}
                href={qualification.href}
                className="qualification-card"
              >
                <span className="qualification-icon">
                  {qualification.icon}
                </span>

                <span className="qualification-card-content">
                  <strong>{qualification.label}</strong>
                  <small>Explore Jobs →</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          LATEST JOBS
      ========================================================= */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OPPORTUNITIES</p>

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
              <p className="text-muted">
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

      {/* =========================================================
          CAREER INSIGHTS
      ========================================================= */}
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
              <p className="text-muted">
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

      {/* =========================================================
          NOTIFICATIONS
      ========================================================= */}
      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">
                STAY UPDATED
              </p>

              <h2>
                Don&apos;t miss what&apos;s next.
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

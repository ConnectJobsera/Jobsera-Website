"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HomeHighlight from "../components/HomeHighlight";
import JobCard from "../components/JobCard";
import { createClient } from "../lib/supabase/client";

type Qualification = {
  label: string;
  value: string;
  href: string;
  icon: "10th" | "12th" | "graduate" | "postgraduate" | "diploma" | "iti";
};

const qualifications: Qualification[] = [
  {
    label: "10th Pass",
    value: "10th Pass",
    href: "/jobs?qualification=10th-pass",
    icon: "10th",
  },
  {
    label: "12th Pass",
    value: "12th Pass",
    href: "/jobs?qualification=12th-pass",
    icon: "12th",
  },
  {
    label: "Graduate",
    value: "Graduate",
    href: "/jobs?qualification=graduate",
    icon: "graduate",
  },
  {
    label: "Post Graduate",
    value: "Post Graduate",
    href: "/jobs?qualification=post-graduate",
    icon: "postgraduate",
  },
  {
    label: "Diploma",
    value: "Diploma",
    href: "/jobs?qualification=diploma",
    icon: "diploma",
  },
  {
    label: "ITI",
    value: "ITI",
    href: "/jobs?qualification=iti",
    icon: "iti",
  },
];

type HomeJob = {
  id: string;
  title: string | null;
  organization: string | null;
  post_name: string | null;
  state: string | null;
  location: string | null;
  qualification: string | null;
  total_vacancy: number | null;
  last_date: string | null;
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

  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

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

function normalizeQualification(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function QualificationIcon({
  type,
}: {
  type: Qualification["icon"];
}) {
  const common = {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  } as const;

  if (type === "diploma") {
    return (
      <svg
        {...common}
        className="qualification-icon qualification-icon-diploma"
      >
        <rect
          x="13"
          y="7"
          width="22"
          height="34"
          rx="3"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M19 15h10M19 21h10M19 27h7"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "iti") {
    return (
      <svg
        {...common}
        className="qualification-icon qualification-icon-iti"
      >
        <circle
          cx="24"
          cy="20"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="m18 30-3 11 9-5 9 5-3-11"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="m24 14 2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5 2-4Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "postgraduate") {
    return (
      <svg
        {...common}
        className="qualification-icon qualification-icon-postgraduate"
      >
        <path
          d="M7 17 24 9l17 8-17 8L7 17Z"
          fill="currentColor"
        />
        <path
          d="M13 21v9c5 4 17 4 22 0v-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M41 18v10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "12th") {
    return (
      <svg
        {...common}
        className="qualification-icon qualification-icon-12th"
      >
        <rect
          x="8"
          y="11"
          width="32"
          height="23"
          rx="3"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M14 18h20M14 24h10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="34" cy="35" r="7" fill="currentColor" />
        <path
          d="m31 35 2 2 4-5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "graduate") {
    return (
      <svg
        {...common}
        className="qualification-icon qualification-icon-graduate"
      >
        <path
          d="M5 16 24 7l19 9-19 9L5 16Z"
          fill="currentColor"
        />
        <path
          d="M12 21v10c6 5 18 5 24 0V21"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M43 18v12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M21 31h6v7h-6z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg
      {...common}
      className="qualification-icon qualification-icon-10th"
    >
      <path
        d="M5 16 24 7l19 9-19 9L5 16Z"
        fill="currentColor"
      />
      <path
        d="M12 21v10c6 5 18 5 24 0V21"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M43 18v12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M21 31h6v7h-6z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [jobs, setJobs] = useState<HomeJob[]>([]);
  const [articles, setArticles] = useState<HomeArticle[]>([]);
  const [highlight, setHighlight] =
    useState<HomeHighlightRow>(defaultHighlight);

  const [qualificationCounts, setQualificationCounts] =
    useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createClient();

    async function loadHomeData() {
      const [
        jobsResult,
        blogsResult,
        highlightsResult,
        qualificationResult,
      ] = await Promise.all([
        supabase
          .from("jobs")
          .select(
            "id, title, organization, post_name, state, location, qualification, total_vacancy, last_date, created_at"
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(3),

        supabase
          .from("blogs")
          .select(
            "slug, category, title_en, description_en"
          )
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3),

        supabase
          .from("highlights")
          .select("text, link")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1),

        supabase
          .from("jobs")
          .select("qualification")
          .eq("is_active", true),
      ]);

      if (jobsResult.data) {
        setJobs(jobsResult.data as HomeJob[]);
      }

      if (blogsResult.data) {
        setArticles(blogsResult.data as HomeArticle[]);
      }

      if (
        highlightsResult.data &&
        highlightsResult.data.length > 0
      ) {
        setHighlight(
          highlightsResult.data[0] as HomeHighlightRow
        );
      }

      if (qualificationResult.data) {
        const counts: Record<string, number> = {};

        qualificationResult.data.forEach((row) => {
          if (typeof row.qualification !== "string") {
            return;
          }

          const value = normalizeQualification(
            row.qualification
          );

          if (!value) {
            return;
          }

          counts[value] = (counts[value] || 0) + 1;
        });

        setQualificationCounts(counts);
      }
    }

    loadHomeData();
  }, []);

  function getQualificationCount(value: string) {
    return (
      qualificationCounts[
        normalizeQualification(value)
      ] || 0
    );
  }

  function handleNotifications() {
    setNotificationMessage(
      "Notifications will be available soon."
    );
  }

  return (
    <>
      {/* =========================
          HERO
      ========================== */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              YOUR NEXT OPPORTUNITY STARTS HERE
            </p>

            <h1 className="hero-title">
              Find Opportunities.
              <br />
              Build <span>Your Future.</span>
            </h1>

            <p className="hero-description">
              Discover the right job opportunities and take
              the next step in your career with Jobsera.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          HIGHLIGHT / ANNOUNCEMENT
      ========================== */}
      <HomeHighlight
        text={highlight.text}
        href={highlight.link}
      />

      {/* =========================
          JOBS BY QUALIFICATION
      ========================== */}
      <section className="section qualification-section">
        <div className="container">
          <div className="section-heading qualification-heading">
            <div>
              <p className="eyebrow">
                FIND YOUR OPPORTUNITY
              </p>

              <h2 className="section-title">
                Jobs By Qualification
              </h2>

              <p className="section-description">
                Browse jobs based on your qualification and
                find opportunities that match your skills.
              </p>
            </div>
          </div>

          <div className="qualification-grid qualification-grid-home">
            {qualifications.map((qualification) => (
              <Link
                key={qualification.href}
                href={qualification.href}
                className={`qualification-card qualification-card-${qualification.icon}`}
              >
                <div className="qualification-icon-wrap">
                  <QualificationIcon
                    type={qualification.icon}
                  />
                </div>

                <strong>
                  {qualification.label}
                </strong>

                <span>
                  {getQualificationCount(
                    qualification.value
                  )}{" "}
                  {getQualificationCount(
                    qualification.value
                  ) === 1
                    ? "Job"
                    : "Jobs"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          LATEST JOBS
      ========================== */}
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
              <p className="text-muted">
                No active jobs yet. Check back soon.
              </p>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  organization={
                    job.organization ||
                    "Organization not specified"
                  }
                  title={
                    job.title ||
                    job.post_name ||
                    "Job opportunity"
                  }
                  post_name={job.post_name || ""}
                  state={job.state || ""}
                  location={job.location || ""}
                  qualification={
                    job.qualification || ""
                  }
                  total_vacancy={job.total_vacancy}
                  last_date={job.last_date}
                  date={formatJobDate(
                    job.created_at
                  )}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================
          CAREER INSIGHTS
      ========================== */}
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
                Practical career guidance to help you move
                forward with confidence.
              </p>
            </div>

            <Link
              href="/blogs"
              className="button button-secondary"
            >
              View All Articles
            </Link>
          </div>

          <div className="card-grid">
            {articles.length === 0 ? (
              <p className="text-muted">
                No published articles yet.
              </p>
            ) : (
              articles.map((article) => (
                <article
                  key={article.slug}
                  className="content-card"
                >
                  <p className="card-category">
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
                    Read Article →
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* =========================
          NOTIFICATIONS
      ========================== */}
      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">
                NEVER MISS AN OPPORTUNITY
              </p>

              <h2>
                Stay updated with new job opportunities.
              </h2>

              <p>
                Get notified when new opportunities are
                added to Jobsera.
              </p>
            </div>

            <button
              type="button"
              className="button button-primary"
              onClick={handleNotifications}
            >
              Get Job Notifications
            </button>
          </div>

          {notificationMessage && (
            <p
              className="text-muted"
              style={{
                marginTop: "12px",
                fontSize: "13px",
              }}
            >
              {notificationMessage}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

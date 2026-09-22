"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import HomeHighlight from "../components/HomeHighlight";
import { createClient } from "../lib/supabase/client";
import { getClientLang } from "../lib/client-lang";
import { t, type Lang } from "../lib/lang";

const qualifications = [
  { key: "qual_10th", href: "/jobs?qualification=10th-pass", icon: "books" },
  { key: "qual_12th", href: "/jobs?qualification=12th-pass", icon: "trophy" },
  { key: "qual_graduate", href: "/jobs?qualification=graduate", icon: "cap" },
  { key: "qual_post_graduate", href: "/jobs?qualification=post-graduate", icon: "bag" },
  { key: "qual_diploma", href: "/jobs?qualification=diploma", icon: "diploma" },
  { key: "qual_iti", href: "/jobs?qualification=iti", icon: "person" },
] as const;

function QualificationIcon({ type }: { type: string }) {
  if (type === "books") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 10h21c3.3 0 6 2.7 6 6v22H16c-3.3 0-6-2.7-6-6V10Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M16 10v28" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M10 32h27" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M22 16h9M22 22h9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "trophy") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 9h14v10c0 6-2.8 10-7 10s-7-4-7-10V9Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M17 13H9v3c0 5 3.5 8 8 8M31 13h8v3c0 5-3.5 8-8 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 29v6M18 39h12M20 35h8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "cap") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="m7 18 17-8 17 8-17 8-17-8Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M13 21v9c6 5 16 5 22 0v-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M41 19v10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "bag") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="14" width="30" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 14v-3c0-2 1.5-3 3.5-3h5c2 0 3.5 1 3.5 3v3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M9 23h30M24 23v6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "diploma") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 8h24v25H10z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M15 15h14M15 21h14M15 27h9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="34" cy="32" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="m30 38-2 7 6-3 6 3-2-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 40c0-8 5-13 12-13s12 5 12 13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

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

type JobTranslation = { company: string; title: string; location: string; type: string; experience: string };
type ArticleTranslation = { title: string; description: string };

const defaultHighlight: HomeHighlightRow = {
  text: "New opportunities added daily – Explore the latest jobs and take the next step in your career.",
  link: "/jobs",
};

async function translateItems(
  items: { sourceTable: string; sourceId: string; field: string; text: string }[]
): Promise<string[]> {
  if (items.length === 0) return [];
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: "hi", items }),
    });
    const json = await response.json();
    return json.translations || items.map((i) => i.text);
  } catch {
    return items.map((i) => i.text);
  }
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [jobs, setJobs] = useState<HomeJob[]>([]);
  const [articles, setArticles] = useState<HomeArticle[]>([]);
  const [highlight, setHighlight] = useState<HomeHighlightRow>(defaultHighlight);

  const [lang, setLang] = useState<Lang>("en");
  const [jobTranslations, setJobTranslations] = useState<Record<string, JobTranslation>>({});
  const [articleTranslations, setArticleTranslations] = useState<Record<string, ArticleTranslation>>({});
  const [highlightText, setHighlightText] = useState<string | null>(null);

  useEffect(() => {
    setLang(getClientLang());
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function loadHomeData() {
      const [jobsResult, blogsResult, highlightsResult] = await Promise.all([
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

  // Translate the dynamic DB content (latest jobs, latest articles, the
  // highlight ticker) once it's loaded and the visitor is in Hindi. Cached
  // server-side per item/field, so this only ever costs an API call once.
  useEffect(() => {
    if (lang !== "hi" || jobs.length === 0) return;
    const needed = jobs.filter((job) => !jobTranslations[job.id]);
    if (needed.length === 0) return;

    async function run() {
      const items = needed.flatMap((job) => [
        { sourceTable: "jobs", sourceId: job.id, field: "home_company", text: job.company || "" },
        { sourceTable: "jobs", sourceId: job.id, field: "home_title", text: job.title || "" },
        { sourceTable: "jobs", sourceId: job.id, field: "home_location", text: job.location || "" },
        { sourceTable: "jobs", sourceId: job.id, field: "home_type", text: job.type || "" },
        { sourceTable: "jobs", sourceId: job.id, field: "home_experience", text: job.experience || "" },
      ]);
      const results = await translateItems(items);
      setJobTranslations((prev) => {
        const next = { ...prev };
        needed.forEach((job, index) => {
          const base = index * 5;
          next[job.id] = {
            company: results[base] || job.company,
            title: results[base + 1] || job.title,
            location: results[base + 2] || job.location,
            type: results[base + 3] || job.type,
            experience: results[base + 4] || job.experience,
          };
        });
        return next;
      });
    }

    run();
  }, [lang, jobs, jobTranslations]);

  useEffect(() => {
    if (lang !== "hi" || articles.length === 0) return;
    const needed = articles.filter((article) => !articleTranslations[article.slug]);
    if (needed.length === 0) return;

    async function run() {
      const items = needed.flatMap((article) => [
        { sourceTable: "blogs", sourceId: article.slug, field: "title", text: article.title_en || "" },
        { sourceTable: "blogs", sourceId: article.slug, field: "description", text: article.description_en || "" },
      ]);
      const results = await translateItems(items);
      setArticleTranslations((prev) => {
        const next = { ...prev };
        needed.forEach((article, index) => {
          const base = index * 2;
          next[article.slug] = {
            title: results[base] || article.title_en,
            description: results[base + 1] || article.description_en,
          };
        });
        return next;
      });
    }

    run();
  }, [lang, articles, articleTranslations]);

  useEffect(() => {
    if (lang !== "hi" || !highlight.text) return;

    async function run() {
      const results = await translateItems([
        { sourceTable: "highlights", sourceId: highlight.link || "home", field: "text", text: highlight.text },
      ]);
      setHighlightText(results[0] || highlight.text);
    }

    run();
  }, [lang, highlight]);

  function formatJobDate(dateString: string) {
    const date = new Date(dateString);
    const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 3) return t(lang, "recently_added");
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    const locationQuery = location.trim();
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (locationQuery) params.set("location", locationQuery);
    const queryString = params.toString();
    window.location.href = queryString ? `/jobs?${queryString}` : "/jobs";
  }

  function handleNotifications() {
    setNotificationMessage(t(lang, "notif_message"));
  }

  return (
    <>
      <section className="hero">
        <div className="hero-doodle hero-doodle-circle" aria-hidden="true" />
        <div className="hero-doodle hero-doodle-spark" aria-hidden="true">✦</div>
        <div className="hero-doodle hero-doodle-star" aria-hidden="true">★</div>
        <div className="hero-doodle hero-doodle-arrow" aria-hidden="true">↗</div>

        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">{t(lang, "hero_eyebrow")}</p>

            <h1 className="hero-title">
              {t(lang, "hero_title_line1")}
              <br />
              {t(lang, "hero_title_line2")} <span>{t(lang, "hero_title_future")}</span>
            </h1>

            <p className="hero-description">{t(lang, "hero_description")}</p>

            <form className="hero-search" onSubmit={handleSearch} role="search">
              <div className="hero-search-field">
                <svg className="hero-search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t(lang, "search_job_input_placeholder")}
                  aria-label={t(lang, "search_job_input_placeholder")}
                />
              </div>

              <div className="hero-search-divider" aria-hidden="true" />

              <div className="hero-search-field">
                <svg className="hero-location-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 10.5C20 15.5 12 21 12 21S4 15.5 4 10.5a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder={t(lang, "location_placeholder")}
                  aria-label={t(lang, "location_placeholder")}
                />
              </div>

              <button type="submit" className="hero-search-button">
                {t(lang, "search_jobs_button")}
              </button>
            </form>

            <div className="hero-quick-links">
              <span>{t(lang, "popular_label")}</span>
              <Link href="/jobs?qualification=10th-pass">{t(lang, "qual_10th")}</Link>
              <Link href="/jobs?qualification=12th-pass">{t(lang, "qual_12th")}</Link>
              <Link href="/jobs?qualification=graduate">{t(lang, "qual_graduate")}</Link>
              <Link href="/jobs?qualification=diploma">{t(lang, "qual_diploma")}</Link>
            </div>
          </div>
        </div>
      </section>

      <HomeHighlight text={highlightText || highlight.text} href={highlight.link} />

      <section className="section qualification-section">
        <div className="container">
          <div className="qualification-heading">
            <p className="eyebrow">{t(lang, "find_your_opportunity_eyebrow")}</p>
            <h2 className="section-title">{t(lang, "jobs_by_qualification_heading")}</h2>
            <p className="section-description">{t(lang, "jobs_by_qualification_desc")}</p>
          </div>

          <div className="qualification-grid">
            {qualifications.map((qualification) => (
              <Link key={qualification.href} href={qualification.href} className="qualification-card">
                <span className="qualification-icon">
                  <QualificationIcon type={qualification.icon} />
                </span>
                <span className="qualification-card-content">
                  <strong>{t(lang, qualification.key)}</strong>
                  <small>{t(lang, "qualification_explore")}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(lang, "opportunities_eyebrow")}</p>
              <h2 className="section-title">{t(lang, "latest_jobs_heading")}</h2>
              <p className="section-description">{t(lang, "latest_jobs_desc")}</p>
            </div>
            <Link href="/jobs" className="button button-secondary">
              {t(lang, "view_all_jobs")}
            </Link>
          </div>

          <div className="job-list">
            {jobs.length === 0 ? (
              <p className="text-muted">{t(lang, "no_active_jobs")}</p>
            ) : (
              jobs.map((job) => {
                const translated = jobTranslations[job.id];
                return (
                  <article className="job-item" key={job.id}>
                    <div className="job-main">
                      <span className="job-company">{translated?.company || job.company}</span>
                      <h3 className="job-title">{translated?.title || job.title}</h3>
                      <div className="job-details">
                        <span>{translated?.location || job.location}</span>
                        <span>{translated?.type || job.type}</span>
                        <span>{translated?.experience || job.experience}</span>
                      </div>
                    </div>
                    <div className="job-side">
                      <span className="job-date">{formatJobDate(job.created_at)}</span>
                      <Link href={`/jobs/${job.id}`} className="job-link">
                        {t(lang, "view_job_link")}
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t(lang, "nav_blogs")}</p>
              <h2 className="section-title">{t(lang, "learn_prepare_grow")}</h2>
              <p className="section-description">{t(lang, "career_insights_desc")}</p>
            </div>
            <Link href="/blogs" className="button button-secondary">
              {t(lang, "view_all_label")}
            </Link>
          </div>

          <div className="card-grid">
            {articles.length === 0 ? (
              <p className="text-muted">{t(lang, "no_articles_home")}</p>
            ) : (
              articles.map((article) => {
                const translated = articleTranslations[article.slug];
                return (
                  <article className="card" key={article.slug}>
                    <div className="card-content">
                      <p className="eyebrow">{article.category}</p>
                      <h3 className="card-title">{translated?.title || article.title_en}</h3>
                      <p className="card-description">{translated?.description || article.description_en}</p>
                      <Link href={`/blogs/${article.slug}`} className="article-link">
                        {t(lang, "read_article_link")}
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">{t(lang, "stay_updated_eyebrow")}</p>
              <h2>{t(lang, "notif_heading")}</h2>
              <p>{t(lang, "notif_desc")}</p>
              {notificationMessage && (
                <p style={{ marginTop: "10px", fontSize: "14px", color: "var(--text-secondary)" }} role="status">
                  {notificationMessage}
                </p>
              )}
            </div>
            <button type="button" className="button button-primary" onClick={handleNotifications}>
              {t(lang, "notif_button")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}


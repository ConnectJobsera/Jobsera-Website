"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import JobCard from "../../components/JobCard";
import { getClientLang } from "../../lib/client-lang";
import { t, type Lang } from "../../lib/lang";

type Job = {
  id: string;
  organization: string | null;
  department: string | null;
  post_name: string | null;
  total_vacancy: number | null;
  state: string | null;
  age_starts: number | null;
  age_limit: number | null;
  age_relaxation: string | null;
  application_mode: string | null;
  application_fee: string | null;
  start_date: string | null;
  last_date: string | null;
  exam_date: string | null;
  salary: string | null;
  selection_process: string | null;
  documents_required: string | null;
  notification_url: string | null;
  company: string | null;
  title: string | null;
  location: string | null;
  type: string | null;
  experience: string | null;
  qualification: string | null;
  description: string | null;
  apply_url: string | null;
  is_active: boolean;
  created_at: string;
};

type TranslatedFields = {
  title: string;
  organization: string;
  post_name: string;
  qualification: string;
};

const qualificationOptions = [
  { label: "All Qualifications", value: "" },
  { label: "8th Pass", value: "8th-pass" },
  { label: "10th Pass", value: "10th-pass" },
  { label: "12th Pass", value: "12th-pass" },
  { label: "Diploma", value: "diploma" },
  { label: "ITI", value: "iti" },
  { label: "Graduate", value: "graduate" },
  { label: "Post Graduate", value: "post-graduate" },
];

const JOBS_PER_PAGE = 10;
const PAGINATION_NUMBER_COUNT = 5;

function normalizeQualification(value: string) {
  return value.trim().toLowerCase().replace(/[_\s]+/g, "-").replace(/-+/g, "-");
}

function qualificationMatches(qualification: string | null, filter: string) {
  if (!filter) return true;
  if (!qualification) return false;

  const jobQualification = normalizeQualification(qualification);
  const requestedQualification = normalizeQualification(filter);

  const aliases: Record<string, string[]> = {
    "8th-pass": ["8th-pass", "8th", "8-pass", "class-8", "class-8th"],
    "10th-pass": ["10th-pass", "10th", "10-pass", "class-10", "class-10th", "matric", "matriculation"],
    "12th-pass": ["12th-pass", "12th", "12-pass", "class-12", "class-12th", "intermediate", "higher-secondary"],
    diploma: ["diploma", "polytechnic"],
    iti: ["iti", "i.t.i", "industrial-training-institute"],
    graduate: ["graduate", "graduation", "bachelor", "bachelors", "degree", "ug"],
    "post-graduate": ["post-graduate", "postgraduate", "pg", "masters", "master", "m.tech", "mtech", "mba", "mca", "ma", "msc", "m.sc", "m.com", "mcom"],
  };

  const accepted = aliases[requestedQualification] || [requestedQualification];

  return accepted.some((item) => {
    const normalizedItem = normalizeQualification(item);
    return (
      jobQualification === normalizedItem ||
      jobQualification.includes(normalizedItem) ||
      normalizedItem.includes(jobQualification)
    );
  });
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function JobsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialQualification = searchParams.get("qualification") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [qualification, setQualification] = useState(initialQualification);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<Lang>("en");
  const [translations, setTranslations] = useState<Record<string, TranslatedFields>>({});

  // Read the language cookie once on mount. The language toggle does a full
  // page reload (see LanguageToggle.tsx), so this always reflects the
  // current choice — no extra listeners needed.
  useEffect(() => {
    setLang(getClientLang());
  }, []);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setQualification(searchParams.get("qualification") || "");
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      setError("");

      const supabase = createClient();
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading jobs:", error);
        setError("Unable to load jobs right now. Please try again.");
        setJobs([]);
        setLoading(false);
        return;
      }

      setJobs((data || []) as Job[]);
      setLoading(false);
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesQualification = qualificationMatches(job.qualification, qualification);
      if (!matchesQualification) return false;
      if (!searchTerm) return true;

      const searchableText = [
        job.organization, job.department, job.post_name, job.company, job.title,
        job.location, job.state, job.qualification, job.type, job.experience, job.salary,
      ].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [jobs, search, qualification]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  // Translate only the 10 cards currently visible, via the API route (this
  // is a client component, so it can't call lib/translate.ts directly).
  // Each field is cached server-side per job, so paging back to a page you
  // already viewed in Hindi costs nothing extra.
  useEffect(() => {
    if (lang !== "hi" || paginatedJobs.length === 0) return;

    const needed = paginatedJobs.filter((job) => !translations[job.id]);
    if (needed.length === 0) return;

    async function translatePage() {
      const items = needed.flatMap((job) => [
        { sourceTable: "jobs", sourceId: job.id, field: "title", text: job.title || job.post_name || "Job opportunity" },
        { sourceTable: "jobs", sourceId: job.id, field: "organization", text: job.organization || job.company || "" },
        { sourceTable: "jobs", sourceId: job.id, field: "post_name", text: job.post_name || "" },
        { sourceTable: "jobs", sourceId: job.id, field: "qualification", text: job.qualification || "" },
      ]);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: "hi", items }),
        });

        const json = await response.json();
        const results: string[] = json.translations || [];

        setTranslations((prev) => {
          const next = { ...prev };
          needed.forEach((job, index) => {
            const base = index * 4;
            next[job.id] = {
              title: results[base] || job.title || "",
              organization: results[base + 1] || job.organization || "",
              post_name: results[base + 2] || job.post_name || "",
              qualification: results[base + 3] || job.qualification || "",
            };
          });
          return next;
        });
      } catch {
        // Fail soft — cards just stay in English if the API call fails.
      }
    }

    translatePage();
  }, [lang, paginatedJobs, translations]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];
    const visibleCount = Math.min(PAGINATION_NUMBER_COUNT, totalPages);
    let startPage = Math.max(1, currentPage - Math.floor(PAGINATION_NUMBER_COUNT / 2));
    const maxStart = Math.max(1, totalPages - visibleCount + 1);
    startPage = Math.min(startPage, maxStart);
    return Array.from({ length: visibleCount }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  function clearFilters() {
    setSearch("");
    setQualification("");
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="jobs-page">
      <section className="jobs-page-header">
        <div className="container">
          <p className="eyebrow">EXPLORE OPPORTUNITIES</p>
          <h1 className="page-title">{t(lang, "find_next_job")}</h1>
          <p className="page-description">{t(lang, "jobs_page_description")}</p>
        </div>
      </section>

      <section className="jobs-section">
        <div className="container">
          <div className="jobs-filter-panel">
            <div className="jobs-filter-search">
              <label htmlFor="job-search">{t(lang, "search_jobs_label")}</label>
              <input
                id="job-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t(lang, "search_jobs_input_placeholder")}
              />
            </div>

            <div className="jobs-filter-select">
              <label htmlFor="qualification">{t(lang, "qualification_label")}</label>
              <select
                id="qualification"
                value={qualification}
                onChange={(event) => {
                  setQualification(event.target.value);
                  setCurrentPage(1);
                }}
              >
                {qualificationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {(search || qualification) && (
              <button type="button" className="button button-secondary jobs-clear-button" onClick={clearFilters}>
                {t(lang, "clear_filters")}
              </button>
            )}
          </div>

          <div className="jobs-results-heading">
            <div>
              <h2>
                {filteredJobs.length} {filteredJobs.length === 1 ? t(lang, "job_singular") : t(lang, "job_plural")} {t(lang, "found_suffix")}
              </h2>

              {qualification && (
                <p>
                  Showing jobs for{" "}
                  <strong>
                    {qualificationOptions.find((option) => option.value === qualification)?.label || qualification}
                  </strong>
                </p>
              )}
            </div>
          </div>

          {loading && (
            <div className="jobs-empty-state">
              <p>{t(lang, "loading_jobs")}</p>
            </div>
          )}

          {!loading && error && (
            <div className="jobs-empty-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredJobs.length === 0 && (
            <div className="jobs-empty-state">
              <h3>{t(lang, "no_jobs_found_heading")}</h3>
              <p>{t(lang, "no_jobs_found_body")}</p>
              <button type="button" className="button button-primary" onClick={clearFilters}>
                {t(lang, "view_all_jobs")}
              </button>
            </div>
          )}

          {!loading && !error && filteredJobs.length > 0 && (
            <>
              <div className="job-list">
                {paginatedJobs.map((job) => {
                  const translated = translations[job.id];
                  return (
                    <JobCard
                      key={job.id}
                      id={job.id}
                      organization={translated?.organization || job.organization || job.company || "Organization not specified"}
                      title={translated?.title || job.title || job.post_name || "Job opportunity"}
                      post_name={translated?.post_name || job.post_name || ""}
                      state={job.state || ""}
                      location={job.location || ""}
                      qualification={translated?.qualification || job.qualification || ""}
                      total_vacancy={job.total_vacancy}
                      last_date={job.last_date}
                      date={formatDate(job.created_at)}
                      lang={lang}
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <nav className="jobs-pagination" aria-label="Jobs pagination">
                  <button
                    type="button"
                    className="pagination-button pagination-previous"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    {t(lang, "previous_label")}
                  </button>

                  <div className="pagination-numbers">
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-number ${page === currentPage ? "active" : ""}`}
                        onClick={() => goToPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-button pagination-next"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    {t(lang, "next_label")}
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <section className="jobs-bottom-cta">
        <div className="container">
          <div className="jobs-cta-card">
            <div>
              <p className="eyebrow">JOBSERA</p>
              <h2>{t(lang, "jobs_cta_heading")}</h2>
              <p>{t(lang, "jobs_cta_body")}</p>
            </div>

            <Link href="/" className="button button-primary">
              {t(lang, "back_to_home")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <main className="jobs-page">
          <section className="jobs-empty-state">
            <p>Loading jobs...</p>
          </section>
        </main>
      }
    >
      <JobsContent />
    </Suspense>
  );
}

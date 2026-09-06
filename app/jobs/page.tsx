"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import JobCard from "../../components/JobCard";

type Job = {
  id: string;

  // Current recruitment fields
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

  // Existing / legacy fields
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

function normalizeQualification(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");
}

function qualificationMatches(
  qualification: string | null,
  filter: string
) {
  if (!filter) {
    return true;
  }

  if (!qualification) {
    return false;
  }

  const jobQualification =
    normalizeQualification(qualification);

  const requestedQualification =
    normalizeQualification(filter);

  const aliases: Record<string, string[]> = {
    "8th-pass": [
      "8th-pass",
      "8th",
      "8-pass",
      "class-8",
      "class-8th",
    ],

    "10th-pass": [
      "10th-pass",
      "10th",
      "10-pass",
      "class-10",
      "class-10th",
      "matric",
      "matriculation",
    ],

    "12th-pass": [
      "12th-pass",
      "12th",
      "12-pass",
      "class-12",
      "class-12th",
      "intermediate",
      "higher-secondary",
    ],

    diploma: [
      "diploma",
      "polytechnic",
    ],

    iti: [
      "iti",
      "i.t.i",
      "industrial-training-institute",
    ],

    graduate: [
      "graduate",
      "graduation",
      "bachelor",
      "bachelors",
      "degree",
      "ug",
    ],

    "post-graduate": [
      "post-graduate",
      "postgraduate",
      "pg",
      "masters",
      "master",
      "m.tech",
      "mtech",
      "mba",
      "mca",
      "ma",
      "msc",
      "m.sc",
      "m.com",
      "mcom",
    ],
  };

  const accepted =
    aliases[requestedQualification] || [
      requestedQualification,
    ];

  return accepted.some((item) => {
    const normalizedItem =
      normalizeQualification(item);

    return (
      jobQualification === normalizedItem ||
      jobQualification.includes(normalizedItem) ||
      normalizedItem.includes(jobQualification)
    );
  });
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "Not specified";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function JobsContent() {
  const searchParams = useSearchParams();

  const initialSearch =
    searchParams.get("search") || "";

  const initialQualification =
    searchParams.get("qualification") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] =
    useState(initialSearch);
  const [qualification, setQualification] =
    useState(initialQualification);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setSearch(
      searchParams.get("search") || ""
    );

    setQualification(
      searchParams.get("qualification") || ""
    );
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
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading jobs:",
          error
        );

        setError(
          "Unable to load jobs right now. Please try again."
        );

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
    const searchTerm =
      search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesQualification =
        qualificationMatches(
          job.qualification,
          qualification
        );

      if (!matchesQualification) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const searchableText = [
        job.organization,
        job.department,
        job.post_name,
        job.company,
        job.title,
        job.location,
        job.state,
        job.qualification,
        job.type,
        job.experience,
        job.salary,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        searchTerm
      );
    });
  }, [
    jobs,
    search,
    qualification,
  ]);

  function clearFilters() {
    setSearch("");
    setQualification("");
  }

  return (
    <main className="jobs-page">
      <section className="jobs-page-header">
        <div className="container">
          <p className="eyebrow">
            EXPLORE OPPORTUNITIES
          </p>

          <h1 className="page-title">
            Find Your Next Job
          </h1>

          <p className="page-description">
            Explore the latest job opportunities and
            find the one that matches your
            qualification and goals.
          </p>
        </div>
      </section>

      <section className="jobs-section">
        <div className="container">
          <div className="jobs-filter-panel">
            <div className="jobs-filter-search">
              <label htmlFor="job-search">
                Search jobs
              </label>

              <input
                id="job-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by job, organization, location..."
              />
            </div>

            <div className="jobs-filter-select">
              <label htmlFor="qualification">
                Qualification
              </label>

              <select
                id="qualification"
                value={qualification}
                onChange={(event) =>
                  setQualification(
                    event.target.value
                  )
                }
              >
                {qualificationOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {(search ||
              qualification) && (
              <button
                type="button"
                className="button button-secondary jobs-clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="jobs-results-heading">
            <div>
              <h2>
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1
                  ? "Job"
                  : "Jobs"}{" "}
                Found
              </h2>

              {qualification && (
                <p>
                  Showing jobs for{" "}
                  <strong>
                    {
                      qualificationOptions.find(
                        (option) =>
                          option.value ===
                          qualification
                      )?.label ||
                      qualification
                    }
                  </strong>
                </p>
              )}
            </div>
          </div>

          {loading && (
            <div className="jobs-empty-state">
              <p>Loading jobs...</p>
            </div>
          )}

          {!loading && error && (
            <div className="jobs-empty-state">
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredJobs.length === 0 && (
              <div className="jobs-empty-state">
                <h3>
                  No jobs found
                </h3>

                <p>
                  Try changing your search or
                  qualification filter.
                </p>

                <button
                  type="button"
                  className="button button-primary"
                  onClick={clearFilters}
                >
                  View All Jobs
                </button>
              </div>
            )}

          {!loading &&
            !error &&
            filteredJobs.length > 0 && (
              <div className="job-list">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    organization={
                      job.organization ||
                      job.company ||
                      "Organization not specified"
                    }
                    title={
                      job.title ||
                      job.post_name ||
                      "Job opportunity"
                    }
                    post_name={
                      job.post_name || ""
                    }
                    state={
                      job.state || ""
                    }
                    location={
                      job.location || ""
                    }
                    qualification={
                      job.qualification || ""
                    }
                    total_vacancy={
                      job.total_vacancy
                    }
                    last_date={
                      job.last_date
                    }
                    date={formatDate(
                      job.created_at
                    )}
                  />
                ))}
              </div>
            )}
        </div>
      </section>

      <section className="jobs-bottom-cta">
        <div className="container">
          <div className="jobs-cta-card">
            <div>
              <p className="eyebrow">
                JOBSERA
              </p>

              <h2>
                Looking for your next opportunity?
              </h2>

              <p>
                Keep checking Jobsera for the latest
                opportunities.
              </p>
            </div>

            <Link
              href="/"
              className="button button-primary"
            >
              Back to Home
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

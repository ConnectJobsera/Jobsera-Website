"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import JobCard from "../../components/JobCard";
import JobFilters from "../../components/JobFilters";
import { createClient } from "../../lib/supabase/client";

type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  qualification: string;
  created_at: string;
};

const qualificationMap: Record<string, string> = {
  "8th-pass": "8th Pass",
  "10th-pass": "10th Pass",
  "12th-pass": "12th Pass",
  diploma: "Diploma",
  graduate: "Graduate",
};

function JobsPageContent() {
  const searchParams = useSearchParams();

  const initialQualification =
    searchParams.get("qualification") || "";

  const initialSearch =
    searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedQualification =
    qualificationMap[initialQualification] || "";

  useEffect(() => {
    async function loadJobs() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, company, title, location, type, experience, qualification, created_at"
        )
        .eq("is_active", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Error loading jobs:", error);
        setError("Unable to load jobs right now.");
        setJobs([]);
      } else {
        setJobs(data || []);
      }

      setLoading(false);
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        [
          job.company,
          job.title,
          job.location,
          job.type,
          job.experience,
          job.qualification,
        ].some((value) =>
          value.toLowerCase().includes(query)
        );

      const matchesQualification =
        !selectedQualification ||
        job.qualification === selectedQualification;

      return matchesSearch && matchesQualification;
    });
  }, [jobs, search, selectedQualification]);

  if (loading) {
    return (
      <main className="content-page">
        <div className="container">
          <p className="eyebrow">OPPORTUNITIES</p>

          <h1>Find Your Next Opportunity</h1>

          <p className="page-intro">
            Loading opportunities...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="content-page">
        <div className="container">
          <p className="eyebrow">OPPORTUNITIES</p>

          <h1>Find Your Next Opportunity</h1>

          <div className="card">
            <div className="card-content">
              <h3 className="card-title">
                Unable to load jobs
              </h3>

              <p className="card-description">
                {error}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="content-page">
      <div className="container">
        <p className="eyebrow">OPPORTUNITIES</p>

        <h1>Find Your Next Opportunity</h1>

        <p className="page-intro">
          Explore job opportunities and find roles that match
          your skills, experience and career goals.
        </p>

        <JobFilters
          value={search}
          onChange={setSearch}
        />

        {selectedQualification && (
          <div
            style={{
              marginTop: "18px",
              padding: "12px 14px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              background: "var(--surface-blue)",
              color: "var(--text-secondary)",
              fontSize: "13px",
            }}
          >
            Showing jobs for{" "}
            <strong
              style={{
                color: "var(--text-primary)",
              }}
            >
              {selectedQualification}
            </strong>
          </div>
        )}

        <section
          className="section"
          style={{
            padding: "38px 0 0",
          }}
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                AVAILABLE JOBS
              </p>

              <h2 className="section-title">
                {filteredJobs.length > 0
                  ? `${filteredJobs.length} ${
                      filteredJobs.length === 1
                        ? "Opportunity"
                        : "Opportunities"
                    }`
                  : "No Opportunities Found"}
              </h2>

              <p className="section-description">
                {search
                  ? `Showing results matching "${search}".`
                  : selectedQualification
                  ? `Browse available ${selectedQualification.toLowerCase()} opportunities.`
                  : "Browse the latest opportunities available on Jobsera."}
              </p>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="job-list">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  company={job.company}
                  title={job.title}
                  location={job.location}
                  type={job.type}
                  experience={job.experience}
                  date={new Date(
                    job.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  No jobs match your search.
                </h3>

                <p className="card-description">
                  Try another keyword or choose a different
                  qualification.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <main className="content-page">
          <div className="container">
            <p className="eyebrow">
              OPPORTUNITIES
            </p>

            <h1>Find Your Next Opportunity</h1>

            <p className="page-intro">
              Loading opportunities...
            </p>
          </div>
        </main>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}

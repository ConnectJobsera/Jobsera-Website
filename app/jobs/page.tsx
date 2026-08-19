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
  // Primary recruitment fields
  title: string;
  organization: string;
  department: string;
  post_name: string;
  total_vacancy: number | null;
  state: string;
  location: string;
  qualification: string;
  age_starts: number | null;
  age_limit: string;
  age_relaxation: string;
  application_mode: string;
  application_fee: string;
  start_date: string | null;
  last_date: string | null;
  exam_date: string | null;
  salary: string;
  selection_process: string;
  documents_required: string;
  notification_url: string;
  // Legacy / compatibility fields
  company: string;
  type: string;
  experience: string;
  description: string;
  apply_url: string;
  // System fields
  is_active: boolean;
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
          `
            id,
            title,
            organization,
            department,
            post_name,
            total_vacancy,
            state,
            location,
            qualification,
            age_starts,
            age_limit,
            age_relaxation,
            application_mode,
            application_fee,
            start_date,
            last_date,
            exam_date,
            salary,
            selection_process,
            documents_required,
            notification_url,
            company,
            type,
            experience,
            description,
            apply_url,
            is_active,
            created_at
          `
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
        setJobs((data || []) as Job[]);
      }
      setLoading(false);
    }
    loadJobs();
  }, []);
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const searchableValues = [
        job.organization,
        job.title,
        job.post_name,
        job.department,
        job.state,
        job.location,
        job.qualification,
        job.salary,
        job.application_mode,
        // Legacy fields retained for older records
        job.company,
        job.type,
        job.experience,
      ];
      const matchesSearch =
        !query ||
        searchableValues.some(
          (value) =>
            value &&
            value.toLowerCase().includes(query)
        );
      const matchesQualification =
        !selectedQualification ||
        job.qualification === selectedQualification;
      return (
        matchesSearch &&
        matchesQualification
      );
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
          Explore job opportunities and find
          recruitment updates that match your
          qualification, location and career goals.
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
                  : "Browse the latest recruitment opportunities available on Jobsera."}
              </p>
            </div>
          </div>
          {filteredJobs.length > 0 ? (
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
                  title={job.title}
                  post_name={
                    job.post_name || ""
                  }
                  state={job.state || ""}
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
                  date={
                    job.created_at
                      ? new Date(
                          job.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : undefined
                  }
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
                  Try another keyword or choose a
                  different qualification.
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

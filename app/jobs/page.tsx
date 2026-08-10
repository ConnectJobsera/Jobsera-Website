"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import JobCard from "../../components/JobCard";
import JobFilters from "../../components/JobFilters";

const jobs = [
  {
    id: "technova-frontend-developer",
    company: "TECHNOVA",
    title: "Frontend Developer",
    location: "Remote",
    type: "Full Time",
    experience: "Entry Level",
    qualification: "Graduate",
    date: "Recently added",
  },
  {
    id: "digital-solutions-customer-support",
    company: "DIGITAL SOLUTIONS",
    title: "Customer Support Executive",
    location: "Delhi",
    type: "Full Time",
    experience: "0–2 years",
    qualification: "12th Pass",
    date: "Recently added",
  },
  {
    id: "startup-hub-marketing-intern",
    company: "STARTUP HUB",
    title: "Marketing Intern",
    location: "Noida",
    type: "Internship",
    experience: "Entry Level",
    qualification: "Graduate",
    date: "Recently added",
  },
  {
    id: "jobsera-content-writer",
    company: "JOBSERA",
    title: "Content Writer",
    location: "Delhi",
    type: "Part Time",
    experience: "Diploma",
    qualification: "Diploma",
    date: "Recently added",
  },
  {
    id: "digital-solutions-sales-executive",
    company: "DIGITAL SOLUTIONS",
    title: "Sales Executive",
    location: "Gurugram",
    type: "Full Time",
    experience: "1–3 years",
    qualification: "10th Pass",
    date: "Recently added",
  },
];

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

  const selectedQualification =
    qualificationMap[initialQualification] || "";

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
  }, [search, selectedQualification]);

  return (
    <main className="content-page">
      <div className="container">
        <p className="eyebrow">OPPORTUNITIES</p>

        <h1>Find Your Next Opportunity</h1>

        <p className="page-intro">
          Explore job opportunities and find roles that match your
          skills, experience and career goals.
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
            <strong style={{ color: "var(--text-primary)" }}>
              {selectedQualification}
            </strong>
          </div>
        )}

        <section
          className="section"
          style={{ padding: "38px 0 0" }}
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">AVAILABLE JOBS</p>

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
                  date={job.date}
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
            <p className="eyebrow">OPPORTUNITIES</p>

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

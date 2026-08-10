"use client";

import { useMemo, useState } from "react";
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
    date: "Recently added",
  },
  {
    id: "digital-solutions-customer-support",
    company: "DIGITAL SOLUTIONS",
    title: "Customer Support Executive",
    location: "Delhi",
    type: "Full Time",
    experience: "0–2 years",
    date: "Recently added",
  },
  {
    id: "startup-hub-marketing-intern",
    company: "STARTUP HUB",
    title: "Marketing Intern",
    location: "Noida",
    type: "Internship",
    experience: "Entry Level",
    date: "Recently added",
  },
  {
    id: "jobsera-content-writer",
    company: "JOBSERA",
    title: "Content Writer",
    location: "Delhi",
    type: "Part Time",
    experience: "0–2 years",
    date: "Recently added",
  },
  {
    id: "digital-solutions-sales-executive",
    company: "DIGITAL SOLUTIONS",
    title: "Sales Executive",
    location: "Gurugram",
    type: "Full Time",
    experience: "1–3 years",
    date: "Recently added",
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) =>
      [
        job.company,
        job.title,
        job.location,
        job.type,
        job.experience,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search]);

  return (
    <main className="content-page">
      <div className="container">
        <p className="eyebrow">OPPORTUNITIES</p>

        <h1>Find Your Next Opportunity</h1>

        <p className="page-intro">
          Explore job opportunities and find roles that match your
          skills, experience and career goals.
        </p>

        <JobFilters value={search} onChange={setSearch} />

        <section className="section" style={{ padding: "38px 0 0" }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">AVAILABLE JOBS</p>

              <h2 className="section-title">
                {filteredJobs.length > 0
                  ? `${filteredJobs.length} ${
                      filteredJobs.length === 1 ? "Opportunity" : "Opportunities"
                    }`
                  : "No Opportunities Found"}
              </h2>

              <p className="section-description">
                {search
                  ? `Showing results matching "${search}".`
                  : "Browse the latest opportunities available on Jobsera."}
              </p>
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="job-list">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  No jobs match your search.
                </h3>

                <p className="card-description">
                  Try another keyword, company, location or job type.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

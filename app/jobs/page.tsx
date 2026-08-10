"use client";

import { useMemo, useState } from "react";
import JobCard from "../../components/JobCard";
import JobFilters from "../../components/JobFilters";

const jobs = [
  {
    company: "Jobsera",
    title: "Frontend Developer",
    location: "Remote",
    type: "Full-time",
    experience: "Entry Level",
    posted: "Recently posted",
  },
  {
    company: "Jobsera",
    title: "Marketing Intern",
    location: "Delhi NCR",
    type: "Internship",
    experience: "Fresher",
    posted: "Recently posted",
  },
  {
    company: "Jobsera",
    title: "Content & Social Media Intern",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    posted: "Recently posted",
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase();

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
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery]);

  return (
    <main>
      <section className="content-page">
        <div className="container">
          <span className="eyebrow">JOB OPPORTUNITIES</span>

          <h1>Find your next opportunity.</h1>

          <p className="page-intro">
            Explore job opportunities, internships and career openings
            designed to help you take the next step in your professional
            journey.
          </p>

          <div style={{ marginTop: "34px" }}>
            <JobFilters onSearch={setSearchQuery} />
          </div>

          <div
            className="job-list"
            style={{ marginTop: "28px" }}
          >
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={`${job.company}-${job.title}`}
                  company={job.company}
                  title={job.title}
                  location={job.location}
                  type={job.type}
                  experience={job.experience}
                  posted={job.posted}
                />
              ))
            ) : (
              <div className="contact-card">
                <h2>No opportunities found</h2>

                <p>
                  Try searching for a different job title, company,
                  location or keyword.
                </p>
              </div>
            )}
          </div>

          <section
            className="notification-section"
            style={{ marginTop: "56px" }}
          >
            <div className="notification-card">
              <div>
                <span className="eyebrow">STAY UPDATED</span>

                <h2>More opportunities are coming.</h2>

                <p>
                  We're continuously working to bring more relevant
                  opportunities to Jobsera. Check back soon for new
                  openings.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

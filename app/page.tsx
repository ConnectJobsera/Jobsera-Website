"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const qualifications = [
  {
    label: "8th Pass",
    href: "/jobs?qualification=8th-pass",
  },
  {
    label: "10th Pass",
    href: "/jobs?qualification=10th-pass",
  },
  {
    label: "12th Pass",
    href: "/jobs?qualification=12th-pass",
  },
  {
    label: "Diploma",
    href: "/jobs?qualification=diploma",
  },
  {
    label: "Graduate",
    href: "/jobs?qualification=graduate",
  },
];

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
];

const articles = [
  {
    slug: "how-to-build-a-resume-that-gets-noticed",
    category: "CAREER GUIDE",
    title: "How to Build a Resume That Gets Noticed",
    description:
      "Simple ways to make your resume clearer, more relevant and easier for employers to understand.",
  },
  {
    slug: "skills-that-can-help-you-grow",
    category: "CAREER GROWTH",
    title: "Skills That Can Help You Grow",
    description:
      "Explore practical skills that can improve your confidence and help you prepare for today's opportunities.",
  },
  {
    slug: "how-to-find-the-right-job",
    category: "JOB SEARCH",
    title: "How to Find the Right Job",
    description:
      "A simple approach to finding opportunities that match your skills, experience and career goals.",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [notificationMessage, setNotificationMessage] =
    useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      window.location.href = `/jobs?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = "/jobs";
    }
  }

  function handleNotifications() {
    setNotificationMessage(
      "Notifications will be available soon."
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">
              YOUR CAREER STARTS HERE
            </p>

            <h1 className="hero-title">
              Stay informed.
              <br />
              <span>Find your next opportunity.</span>
            </h1>

            <p className="hero-description">
              Discover jobs, career information and useful resources
              designed to help you take your next step with confidence.
            </p>

            <div className="hero-actions">
              <Link
                href="/jobs"
                className="button button-primary"
              >
                Explore Jobs
              </Link>

              <Link
                href="/blogs"
                className="button button-secondary"
              >
                Career Insights
              </Link>
            </div>

            <form
              onSubmit={handleSearch}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "28px",
                maxWidth: "680px",
              }}
            >
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs, companies or locations"
                aria-label="Search jobs, companies or locations"
                className="form-input"
                style={{
                  flex: "1 1 300px",
                  minHeight: "46px",
                  height: "46px",
                }}
              />

              <button
                type="submit"
                className="button button-primary"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* QUALIFICATIONS */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                FIND YOUR OPPORTUNITY
              </p>

              <h2 className="section-title">
                Jobs by Qualification
              </h2>

              <p className="section-description">
                Choose your qualification to discover relevant
                opportunities.
              </p>
            </div>
          </div>

          <div className="qualification-grid">
            {qualifications.map((qualification) => (
              <Link
                key={qualification.href}
                href={qualification.href}
                className="qualification-card"
              >
                {qualification.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
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
            {jobs.map((job) => (
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
                    {job.date}
                  </span>

                  <Link
                    href={`/jobs/${job.id}`}
                    className="job-link"
                  >
                    View Job →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
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
            {articles.map((article) => (
              <article
                className="card"
                key={article.slug}
              >
                <div className="card-content">
                  <p className="eyebrow">
                    {article.category}
                  </p>

                  <h3 className="card-title">
                    {article.title}
                  </h3>

                  <p className="card-description">
                    {article.description}
                  </p>

                  <Link
                    href={`/blogs/${article.slug}`}
                    className="article-link"
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">
                STAY UPDATED
              </p>

              <h2>
                Don't miss what's next.
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

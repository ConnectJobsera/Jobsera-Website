import Link from "next/link";

const qualifications = [
  {
    label: "8th Pass",
    href: "/jobs/8th-pass",
  },
  {
    label: "10th Pass",
    href: "/jobs/10th-pass",
  },
  {
    label: "12th Pass",
    href: "/jobs/12th-pass",
  },
  {
    label: "Diploma",
    href: "/jobs/diploma",
  },
  {
    label: "Graduate",
    href: "/jobs/graduate",
  },
];

const jobs = [
  {
    company: "TECHNOVA",
    title: "Frontend Developer",
    location: "Remote",
    type: "Full Time",
    date: "Recently added",
  },
  {
    company: "DIGITAL SOLUTIONS",
    title: "Customer Support Executive",
    location: "Delhi",
    type: "Full Time",
    date: "Recently added",
  },
  {
    company: "STARTUP HUB",
    title: "Marketing Intern",
    location: "Noida",
    type: "Internship",
    date: "Recently added",
  },
];

const articles = [
  {
    category: "CAREER GUIDE",
    title: "How to Build a Resume That Gets Noticed",
    description:
      "Simple ways to make your resume clearer, more relevant and easier for employers to understand.",
  },
  {
    category: "CAREER GROWTH",
    title: "Skills That Can Help You Grow",
    description:
      "Explore practical skills that can improve your confidence and help you prepare for today's opportunities.",
  },
  {
    category: "JOB SEARCH",
    title: "How to Find the Right Job",
    description:
      "A simple approach to finding opportunities that match your skills, experience and career goals.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow">
              YOUR CAREER STARTS HERE
            </p>

            <h1 className="hero-title">
              Find the right
              <br />
              <span>opportunity.</span>
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
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <h2 className="hero-card-title">
                Explore Jobsera
              </h2>

              <span className="hero-card-badge">
                Updated
              </span>
            </div>

            <div className="hero-stat-list">
              <div className="hero-stat">
                <span className="hero-stat-label">
                  Latest opportunities
                </span>

                <span className="hero-stat-value">
                  Explore →
                </span>
              </div>

              <div className="hero-stat">
                <span className="hero-stat-label">
                  Career articles
                </span>

                <span className="hero-stat-value">
                  Read →
                </span>
              </div>

              <div className="hero-stat">
                <span className="hero-stat-label">
                  Jobs by qualification
                </span>

                <span className="hero-stat-value">
                  Browse →
                </span>
              </div>
            </div>
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
                key={`${job.company}-${job.title}`}
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
                  </div>
                </div>

                <div className="job-side">
                  <span className="job-date">
                    {job.date}
                  </span>

                  <Link
                    href="/jobs"
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
                key={article.title}
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
                    href="/blogs"
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
            </div>

            <button
              type="button"
              className="button button-primary"
            >
              Enable Notifications
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

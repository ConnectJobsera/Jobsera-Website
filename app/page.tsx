import Link from "next/link";

const qualifications = [
  { label: "8th Pass Jobs", href: "/jobs/8th-pass" },
  { label: "10th Pass Jobs", href: "/jobs/10th-pass" },
  { label: "12th Pass Jobs", href: "/jobs/12th-pass" },
  { label: "Diploma Jobs", href: "/jobs/diploma" },
  { label: "Graduate Jobs", href: "/jobs/graduate" },
];

const blogs = [
  {
    category: "CAREER GUIDE",
    title: "How to Build a Resume That Gets Noticed",
    description:
      "A strong resume is clear, relevant and easy to scan. Focus on measurable achievements and skills that match the opportunity.",
    date: "July 19, 2026",
  },
  {
    category: "CAREER GROWTH",
    title: "5 Skills Employers Are Looking For",
    description:
      "Communication, problem solving, digital literacy, adaptability and collaboration remain valuable across industries.",
    date: "July 18, 2026",
  },
  {
    category: "JOB SEARCH",
    title: "How to Find the Right Job for You",
    description:
      "Learn how to identify suitable opportunities, understand job requirements and apply with confidence.",
    date: "July 17, 2026",
  },
];

const jobs = [
  {
    company: "TECHNOVA",
    title: "Frontend Developer",
    description:
      "We are looking for a frontend developer comfortable with HTML, CSS and JavaScript. Build responsive interfaces and collaborate with the team.",
    location: "Remote",
    date: "July 19, 2026",
  },
  {
    company: "DIGITAL SOLUTIONS",
    title: "Customer Support Executive",
    description:
      "Join a growing team and help customers resolve their questions while developing valuable communication and problem-solving skills.",
    location: "Delhi",
    date: "July 18, 2026",
  },
  {
    company: "STARTUP HUB",
    title: "Marketing Intern",
    description:
      "Work with a young team on digital marketing, content creation and social media campaigns.",
    location: "Noida",
    date: "July 17, 2026",
  },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-eyebrow">
              Learn · Discover · Apply
            </div>

            <h1 className="hero-title">
              Find opportunities.
              <br />
              Build your <span>career.</span>
            </h1>

            <p className="hero-description">
              Discover useful career articles, job opportunities and
              practical insights — all in one clean platform.
            </p>

            <div className="hero-actions">
              <Link href="/jobs" className="button button-primary">
                Explore Jobs
              </Link>

              <Link href="/blogs" className="button button-secondary">
                Read Blogs
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-header">
              <h2 className="hero-card-title">
                Career opportunities
              </h2>

              <span className="hero-card-badge">
                Updated
              </span>
            </div>

            <div className="hero-stat-list">
              <div className="hero-stat">
                <span className="hero-stat-label">
                  Latest jobs
                </span>

                <span className="hero-stat-value">
                  Explore
                </span>
              </div>

              <div className="hero-stat">
                <span className="hero-stat-label">
                  Career insights
                </span>

                <span className="hero-stat-value">
                  Read
                </span>
              </div>

              <div className="hero-stat">
                <span className="hero-stat-label">
                  Qualification
                </span>

                <span className="hero-stat-value">
                  Find jobs
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
              <p className="hero-eyebrow">QUICK ACCESS</p>

              <h2 className="section-title">
                Jobs by Qualification
              </h2>

              <p className="section-description">
                Quickly find opportunities based on your
                educational qualification.
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

      {/* BLOGS */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="hero-eyebrow">INSIGHTS</p>

              <h2 className="section-title">
                Latest Blogs
              </h2>

              <p className="section-description">
                Career knowledge and practical advice to help
                you move forward.
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
            {blogs.map((blog) => (
              <article className="card" key={blog.title}>
                <div className="card-content">
                  <p
                    style={{
                      color: "var(--jobsera-blue)",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {blog.category}
                  </p>

                  <h3
                    className="card-title"
                    style={{ marginTop: "12px" }}
                  >
                    {blog.title}
                  </h3>

                  <p className="card-description">
                    {blog.description}
                  </p>

                  <div className="card-meta">
                    <span className="meta-pill">
                      Read article
                    </span>

                    <span className="meta-pill">
                      {blog.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="hero-eyebrow">OPPORTUNITIES</p>

              <h2 className="section-title">
                Latest Jobs
              </h2>

              <p className="section-description">
                Explore recently added opportunities and find
                a role that matches your skills.
              </p>
            </div>

            <Link
              href="/jobs"
              className="button button-secondary"
            >
              View All Jobs
            </Link>
          </div>

          <div className="card-grid">
            {jobs.map((job) => (
              <article className="card" key={job.title}>
                <div className="card-content">
                  <p
                    style={{
                      color: "var(--jobsera-blue)",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {job.company}
                  </p>

                  <h3
                    className="card-title"
                    style={{ marginTop: "12px" }}
                  >
                    {job.title}
                  </h3>

                  <p className="card-description">
                    {job.description}
                  </p>

                  <div className="card-meta">
                    <span className="meta-pill">
                      {job.location}
                    </span>

                    <span className="meta-pill">
                      {job.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NOTIFICATION CTA */}
      <section className="section section-muted">
        <div className="container text-center">
          <h2 className="section-title">
            Never miss an opportunity.
          </h2>

          <p
            className="section-description"
            style={{
              marginInline: "auto",
              marginTop: "12px",
            }}
          >
            Enable Jobsera notifications to stay updated about
            new opportunities, articles and important updates.
          </p>

          <div
            className="hero-actions"
            style={{
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="button button-primary"
            >
              Enable Notifications
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

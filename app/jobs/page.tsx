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

          <div className="job-list" style={{ marginTop: "42px" }}>
            {jobs.map((job) => (
              <article className="job-item" key={job.title}>
                <div className="job-main">
                  <span className="job-company">{job.company}</span>

                  <h2 className="job-title">{job.title}</h2>

                  <div className="job-details">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                    <span>{job.experience}</span>
                  </div>
                </div>

                <div className="job-side">
                  <span className="job-date">{job.posted}</span>

                  <a href="#" className="job-link">
                    View Opportunity →
                  </a>
                </div>
              </article>
            ))}
          </div>

          <section className="notification-section" style={{ marginTop: "56px" }}>
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

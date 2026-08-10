import JobCard from "../../components/JobCard";

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
              <JobCard
                key={`${job.company}-${job.title}`}
                company={job.company}
                title={job.title}
                location={job.location}
                type={job.type}
                experience={job.experience}
                posted={job.posted}
              />
            ))}
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

import Link from "next/link";
import { notFound } from "next/navigation";

const jobs = [
  {
    id: "technova-frontend-developer",
    company: "TECHNOVA",
    title: "Frontend Developer",
    location: "Remote",
    type: "Full Time",
    experience: "Entry Level",
    date: "Recently added",
    description:
      "Join the TECHNOVA team as a Frontend Developer and help build clean, responsive and user-friendly digital experiences.",
  },
  {
    id: "digital-solutions-customer-support",
    company: "DIGITAL SOLUTIONS",
    title: "Customer Support Executive",
    location: "Delhi",
    type: "Full Time",
    experience: "0–2 years",
    date: "Recently added",
    description:
      "Help customers solve problems, answer questions and create a positive experience while working with the Digital Solutions team.",
  },
  {
    id: "startup-hub-marketing-intern",
    company: "STARTUP HUB",
    title: "Marketing Intern",
    location: "Noida",
    type: "Internship",
    experience: "Entry Level",
    date: "Recently added",
    description:
      "Work with the marketing team on campaigns, content and research while gaining practical experience in a growing startup environment.",
  },
  {
    id: "jobsera-content-writer",
    company: "JOBSERA",
    title: "Content Writer",
    location: "Delhi",
    type: "Part Time",
    experience: "0–2 years",
    date: "Recently added",
    description:
      "Create clear, useful and engaging career-focused content for the Jobsera audience across articles and digital platforms.",
  },
  {
    id: "digital-solutions-sales-executive",
    company: "DIGITAL SOLUTIONS",
    title: "Sales Executive",
    location: "Gurugram",
    type: "Full Time",
    experience: "1–3 years",
    date: "Recently added",
    description:
      "Support business growth by connecting with potential customers, understanding their requirements and helping develop new opportunities.",
  },
];

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  const { id } = await params;

  const job = jobs.find((item) => item.id === id);

  if (!job) {
    notFound();
  }

  return (
    <main className="content-page">
      <div className="container">
        <Link href="/jobs" className="job-link">
          ← Back to Jobs
        </Link>

        <div style={{ marginTop: "28px" }}>
          <p className="eyebrow">{job.company}</p>

          <h1>{job.title}</h1>

          <p className="page-intro">
            {job.description}
          </p>
        </div>

        <section className="content-section">
          <h2>Job Details</h2>

          <div className="job-details" style={{ marginTop: "16px" }}>
            <span>{job.location}</span>
            <span>{job.type}</span>
            <span>{job.experience}</span>
          </div>
        </section>

        <section className="content-section">
          <h2>About this opportunity</h2>

          <p>
            This opportunity is listed on Jobsera to help candidates
            discover relevant roles and take their next career step.
            Review the job information carefully before applying.
          </p>
        </section>

        <section className="contact-card">
          <h2>Interested in this opportunity?</h2>

          <p>
            For enquiries or application-related information, contact
            Jobsera using the email address below.
          </p>

          <a
            href="mailto:connectjobsera@gmail.com"
            className="contact-email"
          >
            connectjobsera@gmail.com
          </a>
        </section>
      </div>
    </main>
  );
}

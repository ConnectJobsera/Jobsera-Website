import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      "id, company, title, location, type, experience, qualification, description, apply_url, created_at"
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !job) {
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

          <div
            className="job-details"
            style={{ marginTop: "16px" }}
          >
            <span>{job.location}</span>
            <span>{job.type}</span>
            <span>{job.experience}</span>
            <span>{job.qualification}</span>
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

        {job.apply_url && (
          <section className="content-section">
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              Apply for this job →
            </a>
          </section>
        )}

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

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};
type Job = {
  id: string;
  // Primary recruitment fields
  title: string;
  organization: string;
  department: string;
  post_name: string;
  total_vacancy: number | null;
  state: string;
  location: string;
  qualification: string;
  age_starts: number | null;
  age_limit: string;
  age_relaxation: string;
  application_mode: string;
  application_fee: string;
  start_date: string | null;
  last_date: string | null;
  exam_date: string | null;
  salary: string;
  selection_process: string;
  documents_required: string;
  notification_url: string;
  // Legacy / compatibility fields
  company: string;
  type: string;
  experience: string;
  description: string;
  apply_url: string;
  created_at: string;
};
function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
        id,
        title,
        organization,
        department,
        post_name,
        total_vacancy,
        state,
        location,
        qualification,
        age_starts,
        age_limit,
        age_relaxation,
        application_mode,
        application_fee,
        start_date,
        last_date,
        exam_date,
        salary,
        selection_process,
        documents_required,
        notification_url,
        company,
        type,
        experience,
        description,
        apply_url,
        created_at
      `
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();
  if (error || !job) {
    notFound();
  }
  const data = job as Job;
  const organization =
    data.organization ||
    data.company ||
    "Organization not specified";
  const hasLegacyDescription =
    Boolean(data.description?.trim());
  return (
    <main className="content-page">
      <div className="container">
        <Link href="/jobs" className="job-link">
          ← Back to Jobs
        </Link>
        {/* HEADER */}
        <div
          style={{
            marginTop: "28px",
          }}
        >
          <p className="eyebrow">
            {organization}
          </p>
          <h1>{data.title}</h1>
          {data.post_name && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "17px",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              {data.post_name}
            </p>
          )}
          {data.department && (
            <p
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              {data.department}
            </p>
          )}
        </div>
        {/* QUICK INFORMATION */}
        <section className="content-section">
          <h2>Job Overview</h2>
          <div
            className="job-details"
            style={{
              marginTop: "16px",
            }}
          >
            {data.state && (
              <span>{data.state}</span>
            )}
            {data.location && (
              <span>{data.location}</span>
            )}
            {data.qualification && (
              <span>{data.qualification}</span>
            )}
            {data.total_vacancy !== null &&
              data.total_vacancy !== undefined && (
                <span>
                  {data.total_vacancy}{" "}
                  {data.total_vacancy === 1
                    ? "Vacancy"
                    : "Vacancies"}
                </span>
              )}
          </div>
        </section>
        {/* IMPORTANT DATES */}
        {(data.start_date ||
          data.last_date ||
          data.exam_date) && (
          <section className="content-section">
            <h2>Important Dates</h2>
            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {data.start_date && (
                <div>
                  <strong>
                    Application Start Date:
                  </strong>{" "}
                  {formatDate(data.start_date)}
                </div>
              )}
              {data.last_date && (
                <div>
                  <strong>
                    Last Date:
                  </strong>{" "}
                  {formatDate(data.last_date)}
                </div>
              )}
              {data.exam_date && (
                <div>
                  <strong>
                    Exam Date:
                  </strong>{" "}
                  {formatDate(data.exam_date)}
                </div>
              )}
            </div>
          </section>
        )}
        {/* ELIGIBILITY */}
        {(data.qualification ||
          data.age_starts !== null ||
          data.age_limit ||
          data.age_relaxation) && (
          <section className="content-section">
            <h2>Eligibility</h2>
            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {data.qualification && (
                <div>
                  <strong>
                    Educational Qualification:
                  </strong>{" "}
                  {data.qualification}
                </div>
              )}
              {data.age_starts !== null &&
                data.age_starts !== undefined && (
                  <div>
                    <strong>
                      Starting Age:
                    </strong>{" "}
                    {data.age_starts} years
                  </div>
                )}
              {data.age_limit && (
                <div>
                  <strong>
                    Age Limit:
                  </strong>{" "}
                  {data.age_limit}
                </div>
              )}
              {data.age_relaxation && (
                <div>
                  <strong>
                    Age Relaxation:
                  </strong>{" "}
                  {data.age_relaxation}
                </div>
              )}
            </div>
          </section>
        )}
        {/* APPLICATION DETAILS */}
        {(data.application_mode ||
          data.application_fee) && (
          <section className="content-section">
            <h2>Application Details</h2>
            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {data.application_mode && (
                <div>
                  <strong>
                    Application Mode:
                  </strong>{" "}
                  {data.application_mode}
                </div>
              )}
              {data.application_fee && (
                <div>
                  <strong>
                    Application Fee:
                  </strong>{" "}
                  {data.application_fee}
                </div>
              )}
            </div>
          </section>
        )}
        {/* SALARY */}
        {data.salary && (
          <section className="content-section">
            <h2>Salary / Pay Scale</h2>
            <p
              style={{
                marginTop: "12px",
              }}
            >
              {data.salary}
            </p>
          </section>
        )}
        {/* SELECTION PROCESS */}
        {data.selection_process && (
          <section className="content-section">
            <h2>Selection Process</h2>
            <p
              style={{
                marginTop: "12px",
                whiteSpace: "pre-line",
              }}
            >
              {data.selection_process}
            </p>
          </section>
        )}
        {/* DOCUMENTS */}
        {data.documents_required && (
          <section className="content-section">
            <h2>Documents Required</h2>
            <p
              style={{
                marginTop: "12px",
                whiteSpace: "pre-line",
              }}
            >
              {data.documents_required}
            </p>
          </section>
        )}
        {/* LEGACY DESCRIPTION */}
        {hasLegacyDescription && (
          <section className="content-section">
            <h2>About this opportunity</h2>
            <p
              style={{
                marginTop: "12px",
                whiteSpace: "pre-line",
              }}
            >
              {data.description}
            </p>
          </section>
        )}
        {/* OFFICIAL LINKS */}
        {(data.notification_url ||
          data.apply_url) && (
          <section className="content-section">
            <h2>Official Links</h2>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "16px",
              }}
            >
              {data.notification_url && (
                <a
                  href={data.notification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary"
                >
                  View Official Notification →
                </a>
              )}
              {data.apply_url && (
                <a
                  href={data.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-primary"
                >
                  Apply Now →
                </a>
              )}
            </div>
          </section>
        )}
        {/* CONTACT */}
        <section className="contact-card">
          <h2>
            Interested in this opportunity?
          </h2>
          <p>
            Review the recruitment information
            carefully before applying. For enquiries
            or application-related information,
            contact Jobsera using the email address
            below.
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

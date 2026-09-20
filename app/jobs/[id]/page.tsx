import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "../../../lib/supabase/server";
import { getLang } from "../../../lib/get-lang";
import { t } from "../../../lib/lang";
import { translateCached } from "../../../lib/translate";
import LinkBox from "../../../components/LinkBox";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Job = {
  id: string;
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
  company: string;
  type: string;
  experience: string;
  description: string;
  apply_url: string;
  created_at: string;
};

const siteUrl = "https://www.thejobsera.com";

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function getJob(id: string) {
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
    return null;
  }

  return job as Job;
}

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getJob(id);

  if (!data) {
    return { title: "Job not found" };
  }

  const organization = data.organization || data.company || "Jobsera";
  const title = `${data.title}${data.post_name ? ` — ${data.post_name}` : ""}`;
  const description = (
    data.description ||
    data.selection_process ||
    `${data.title} at ${organization}. Check eligibility, important dates and apply online.`
  ).slice(0, 160);
  const url = `${siteUrl}/jobs/${data.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JobDetailPage({
  params,
}: JobDetailPageProps) {
  const { id } = await params;
  const [data, lang] = await Promise.all([getJob(id), getLang()]);

  if (!data) {
    notFound();
  }

  const job = data as Job;
  const organization =
    job.organization || job.company || "Organization not specified";
  const hasLegacyDescription = Boolean(job.description?.trim());

  const [
    title,
    postName,
    department,
    qualification,
    salary,
    selectionProcess,
    documentsRequired,
    description,
  ] = await Promise.all([
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "title", text: job.title, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "post_name", text: job.post_name, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "department", text: job.department, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "qualification", text: job.qualification, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "salary", text: job.salary, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "selection_process", text: job.selection_process, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "documents_required", text: job.documents_required, lang }),
    translateCached({ sourceTable: "jobs", sourceId: job.id, field: "description", text: job.description, lang }),
  ]);

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description:
      job.description || job.selection_process || `${job.title} at ${organization}`,
    identifier: {
      "@type": "PropertyValue",
      name: organization,
      value: job.id,
    },
    datePosted: job.created_at,
    ...(job.last_date ? { validThrough: `${job.last_date}T23:59:59+05:30` } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: organization,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || undefined,
        addressRegion: job.state || undefined,
        addressCountry: "IN",
      },
    },
    directApply: Boolean(job.apply_url),
  };

  return (
    <main className="content-page">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />

        <Link href="/jobs" className="job-link">
          {t(lang, "back_to_jobs")}
        </Link>

        <div style={{ marginTop: "28px" }}>
          <p className="eyebrow">{organization}</p>
          <h1>{title}</h1>
          {postName && (
            <p style={{ marginTop: "8px", fontSize: "17px", fontWeight: 600, color: "var(--text-secondary)" }}>
              {postName}
            </p>
          )}
          {department && (
            <p style={{ marginTop: "6px", fontSize: "14px", color: "var(--text-secondary)" }}>
              {department}
            </p>
          )}
        </div>

        <section className="content-section">
          <h2>{t(lang, "job_overview")}</h2>
          <div className="job-details" style={{ marginTop: "16px" }}>
            {job.state && <span>{job.state}</span>}
            {job.location && <span>{job.location}</span>}
            {qualification && <span>{qualification}</span>}
            {job.total_vacancy !== null && job.total_vacancy !== undefined && (
              <span>
                {job.total_vacancy}{" "}
                {job.total_vacancy === 1 ? t(lang, "vacancy_singular") : t(lang, "vacancy_plural")}
              </span>
            )}
          </div>
        </section>

        {(job.start_date || job.last_date || job.exam_date) && (
          <section className="content-section">
            <h2>{t(lang, "important_dates")}</h2>
            <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
              {job.start_date && (
                <div>
                  <strong>{t(lang, "application_start_date")}</strong> {formatDate(job.start_date)}
                </div>
              )}
              {job.last_date && (
                <div>
                  <strong>{t(lang, "last_date_label")}</strong> {formatDate(job.last_date)}
                </div>
              )}
              {job.exam_date && (
                <div>
                  <strong>{t(lang, "exam_date_label")}</strong> {formatDate(job.exam_date)}
                </div>
              )}
            </div>
          </section>
        )}

        {(qualification || job.age_starts !== null || job.age_limit || job.age_relaxation) && (
          <section className="content-section">
            <h2>{t(lang, "eligibility")}</h2>
            <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
              {qualification && (
                <div>
                  <strong>{t(lang, "educational_qualification")}</strong> {qualification}
                </div>
              )}
              {job.age_starts !== null && job.age_starts !== undefined && (
                <div>
                  <strong>{t(lang, "starting_age")}</strong> {job.age_starts} {t(lang, "years_suffix")}
                </div>
              )}
              {job.age_limit && (
                <div>
                  <strong>{t(lang, "age_limit_label")}</strong> {job.age_limit}
                </div>
              )}
              {job.age_relaxation && (
                <div>
                  <strong>{t(lang, "age_relaxation_label")}</strong> {job.age_relaxation}
                </div>
              )}
            </div>
          </section>
        )}

        {(job.application_mode || job.application_fee) && (
          <section className="content-section">
            <h2>{t(lang, "application_details")}</h2>
            <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
              {job.application_mode && (
                <div>
                  <strong>{t(lang, "application_mode_label")}</strong> {job.application_mode}
                </div>
              )}
              {job.application_fee && (
                <div>
                  <strong>{t(lang, "application_fee_label")}</strong> {job.application_fee}
                </div>
              )}
            </div>
          </section>
        )}

        <LinkBox groupKey="job_middle" lang={lang} />

        {salary && (
          <section className="content-section">
            <h2>{t(lang, "salary_heading")}</h2>
            <p style={{ marginTop: "12px" }}>{salary}</p>
          </section>
        )}

        {selectionProcess && (
          <section className="content-section">
            <h2>{t(lang, "selection_process_heading")}</h2>
            <p style={{ marginTop: "12px", whiteSpace: "pre-line" }}>{selectionProcess}</p>
          </section>
        )}

        {documentsRequired && (
          <section className="content-section">
            <h2>{t(lang, "documents_required_heading")}</h2>
            <p style={{ marginTop: "12px", whiteSpace: "pre-line" }}>{documentsRequired}</p>
          </section>
        )}

        {hasLegacyDescription && (
          <section className="content-section">
            <h2>{t(lang, "about_opportunity")}</h2>
            <p style={{ marginTop: "12px", whiteSpace: "pre-line" }}>{description}</p>
          </section>
        )}

        {(job.notification_url || job.apply_url) && (
          <section className="content-section">
            <h2>{t(lang, "official_links")}</h2>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
              {job.notification_url && (
                <a href={job.notification_url} target="_blank" rel="noopener noreferrer" className="button button-secondary">
                  {t(lang, "view_notification")}
                </a>
              )}
              {job.apply_url && (
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="button button-primary">
                  {t(lang, "apply_now")}
                </a>
              )}
            </div>
          </section>
        )}

        <LinkBox groupKey="job_bottom" lang={lang} />

        <section className="contact-card">
          <h2>{t(lang, "contact_heading")}</h2>
          <p>{t(lang, "contact_body")}</p>
          <a href="mailto:connectjobsera@gmail.com" className="contact-email">
            connectjobsera@gmail.com
          </a>
        </section>
      </div>
    </main>
  );
}

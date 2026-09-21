import Link from "next/link";
import { t, type Lang } from "../lib/lang";

type JobCardProps = {
  id: string;
  organization: string;
  title: string;
  post_name: string;
  state: string;
  location: string;
  qualification: string;
  total_vacancy?: number | null;
  last_date?: string | null;
  date?: string;
  lang?: Lang;
};

export default function JobCard({
  id,
  organization,
  title,
  post_name,
  state,
  location,
  qualification,
  total_vacancy,
  last_date,
  date,
  lang = "en",
}: JobCardProps) {
  return (
    <article className="job-item">
      <div className="job-main">
        <span className="job-company">{organization}</span>

        <h3 className="job-title">{title}</h3>

        {post_name && (
          <p style={{ margin: "4px 0 8px", fontSize: "14px", fontWeight: 600 }}>
            {post_name}
          </p>
        )}

        <div className="job-details">
          {state && <span>{state}</span>}
          {location && <span>{location}</span>}
          {qualification && <span>{qualification}</span>}
          {total_vacancy !== null && total_vacancy !== undefined && (
            <span>
              {total_vacancy}{" "}
              {total_vacancy === 1 ? t(lang, "vacancy_singular") : t(lang, "vacancy_plural")}
            </span>
          )}
        </div>
      </div>

      <div className="job-side">
        {last_date && (
          <span className="job-date">
            {t(lang, "last_date_label")}{" "}
            {new Date(`${last_date}T00:00:00`).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}

        {!last_date && date && <span className="job-date">{date}</span>}

        <Link href={`/jobs/${id}`} className="job-link">
          {t(lang, "view_job_link")}
        </Link>
      </div>
    </article>
  );
}

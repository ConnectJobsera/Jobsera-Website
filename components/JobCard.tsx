import Link from "next/link";

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
}: JobCardProps) {
  return (
    <article className="job-item">
      <div className="job-main">
        <span className="job-company">
          {organization}
        </span>

        <h3 className="job-title">{title}</h3>

        {post_name && (
          <p
            style={{
              margin: "4px 0 8px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {post_name}
          </p>
        )}

        <div className="job-details">
          {state && <span>{state}</span>}
          {location && <span>{location}</span>}
          {qualification && <span>{qualification}</span>}
          {total_vacancy !== null &&
            total_vacancy !== undefined && (
              <span>
                {total_vacancy}{" "}
                {total_vacancy === 1
                  ? "Vacancy"
                  : "Vacancies"}
              </span>
            )}
        </div>
      </div>

      <div className="job-side">
        {last_date && (
          <span className="job-date">
            Last Date:{" "}
            {new Date(
              `${last_date}T00:00:00`
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}

        {!last_date && date && (
          <span className="job-date">
            {date}
          </span>
        )}

        <Link
          href={`/jobs/${id}`}
          className="job-link"
        >
          View Job →
        </Link>
      </div>
    </article>
  );
}

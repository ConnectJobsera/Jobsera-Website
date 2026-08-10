import Link from "next/link";

type JobCardProps = {
  id: string;
  company: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  date?: string;
};

export default function JobCard({
  id,
  company,
  title,
  location,
  type,
  experience,
  date,
}: JobCardProps) {
  return (
    <article className="job-item">
      <div className="job-main">
        <span className="job-company">{company}</span>

        <h3 className="job-title">{title}</h3>

        <div className="job-details">
          <span>{location}</span>
          <span>{type}</span>
          <span>{experience}</span>
        </div>
      </div>

      <div className="job-side">
        {date && <span className="job-date">{date}</span>}

        <Link href={`/jobs/${id}`} className="job-link">
          View Job →
        </Link>
      </div>
    </article>
  );
}

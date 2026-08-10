type JobCardProps = {
  company: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  posted: string;
};

export default function JobCard({
  company,
  title,
  location,
  type,
  experience,
  posted,
}: JobCardProps) {
  return (
    <article className="job-item">
      <div className="job-main">
        <span className="job-company">{company}</span>

        <h2 className="job-title">{title}</h2>

        <div className="job-details">
          <span>{location}</span>
          <span>{type}</span>
          <span>{experience}</span>
        </div>
      </div>

      <div className="job-side">
        <span className="job-date">{posted}</span>

        <a href="#" className="job-link">
          View Opportunity →
        </a>
      </div>
    </article>
  );
}

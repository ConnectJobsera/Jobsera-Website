type JobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;

  return (
    <main>
      <section className="content-page">
        <div className="container">
          <span className="eyebrow">JOB OPPORTUNITY</span>

          <h1>Frontend Developer</h1>

          <p className="page-intro">
            This opportunity is currently available through Jobsera.
            Explore the role, requirements and application details below.
          </p>

          <div className="contact-card">
            <h2>Role details</h2>

            <p>
              <strong>Company:</strong> Jobsera
            </p>

            <p>
              <strong>Location:</strong> Remote
            </p>

            <p>
              <strong>Employment type:</strong> Full-time
            </p>

            <p>
              <strong>Experience:</strong> Entry Level
            </p>

            <p>
              <strong>Opportunity ID:</strong> {id}
            </p>

            <a
              href="mailto:connectjobsera@gmail.com"
              className="contact-email"
            >
              Apply / Enquire →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

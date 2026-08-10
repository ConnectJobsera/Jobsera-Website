import Link from "next/link";
import BlogCard from "../../components/BlogCard";

const articles = [
  {
    category: "CAREER GUIDE",
    title: "How to Build a Resume That Gets Noticed",
    description:
      "Simple ways to make your resume clearer, more relevant and easier for employers to understand.",
    slug: "how-to-build-a-resume-that-gets-noticed",
  },
  {
    category: "CAREER GROWTH",
    title: "Skills That Can Help You Grow",
    description:
      "Explore practical skills that can improve your confidence and help you prepare for today's opportunities.",
    slug: "skills-that-can-help-you-grow",
  },
  {
    category: "JOB SEARCH",
    title: "How to Find the Right Job",
    description:
      "A simple approach to finding opportunities that match your skills, experience and career goals.",
    slug: "how-to-find-the-right-job",
  },
  {
    category: "INTERVIEW GUIDE",
    title: "How to Prepare for Your Next Interview",
    description:
      "Practical ways to prepare, communicate confidently and make a stronger impression during an interview.",
    slug: "how-to-prepare-for-your-next-interview",
  },
  {
    category: "CAREER GUIDE",
    title: "What Employers Look For in Candidates",
    description:
      "Understand the qualities, skills and habits that can help you stand out when applying for opportunities.",
    slug: "what-employers-look-for-in-candidates",
  },
  {
    category: "JOB SEARCH",
    title: "Common Job Search Mistakes to Avoid",
    description:
      "Avoid common mistakes that can make your job search harder and learn how to approach opportunities more effectively.",
    slug: "common-job-search-mistakes-to-avoid",
  },
];

export default function BlogsPage() {
  return (
    <>
      <section className="content-page">
        <div className="container">
          <p className="eyebrow">CAREER INSIGHTS</p>

          <h1>Learn. Prepare. Grow.</h1>

          <p className="page-intro">
            Practical career information, job search guidance and useful
            insights to help you make better decisions about your career.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LATEST ARTICLES</p>

              <h2 className="section-title">
                Explore Career Resources
              </h2>

              <p className="section-description">
                Read useful guides and insights designed to help you prepare
                for your next opportunity.
              </p>
            </div>
          </div>

          <div className="card-grid">
            {articles.map((article) => (
              <BlogCard
                key={article.slug}
                category={article.category}
                title={article.title}
                description={article.description}
                slug={article.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="notification-section">
        <div className="container">
          <div className="notification-card">
            <div>
              <p className="eyebrow">LOOKING FOR OPPORTUNITIES?</p>

              <h2>Find your next opportunity.</h2>

              <p>
                Explore Jobsera's latest job opportunities and take the next
                step in your career.
              </p>
            </div>

            <Link href="/jobs" className="button button-primary">
              Explore Jobs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

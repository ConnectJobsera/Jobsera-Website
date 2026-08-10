import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  "how-to-build-a-resume-that-gets-noticed": {
    category: "CAREER GUIDE",
    title: "How to Build a Resume That Gets Noticed",
    intro:
      "A clear and relevant resume can make it easier for employers to understand your skills, experience and potential.",
    sections: [
      {
        heading: "Keep your resume clear",
        paragraphs: [
          "A good resume should be easy to scan. Keep the structure simple and make important information easy to find.",
          "Use clear headings, short descriptions and consistent formatting throughout the document.",
        ],
      },
      {
        heading: "Focus on what matters",
        paragraphs: [
          "Your resume does not need to include everything you have ever done. Focus on experience, education and skills that are relevant to the opportunity you are applying for.",
        ],
      },
      {
        heading: "Show your skills with examples",
        paragraphs: [
          "Whenever possible, explain what you actually achieved or worked on instead of simply listing a skill.",
          "Projects, internships, volunteering and practical experience can all help demonstrate what you can do.",
        ],
      },
      {
        heading: "Review before applying",
        paragraphs: [
          "Check your resume carefully for spelling, formatting and outdated information before sending it to an employer.",
          "A few minutes of review can make your application look considerably more professional.",
        ],
      },
    ],
  },

  "skills-that-can-help-you-grow": {
    category: "CAREER GROWTH",
    title: "Skills That Can Help You Grow",
    intro:
      "Building practical skills can improve your confidence and help you prepare for changing opportunities.",
    sections: [
      {
        heading: "Communication",
        paragraphs: [
          "Strong communication helps you explain ideas clearly, work with others and build professional relationships.",
        ],
      },
      {
        heading: "Problem solving",
        paragraphs: [
          "Employers value people who can understand problems, think logically and work toward practical solutions.",
        ],
      },
      {
        heading: "Digital skills",
        paragraphs: [
          "Basic digital skills are useful across many careers. Depending on your goals, this could include productivity tools, design, coding, data or digital marketing.",
        ],
      },
      {
        heading: "Keep learning",
        paragraphs: [
          "Career growth is not limited to formal education. Projects, internships, courses and practical experience can all contribute to your development.",
        ],
      },
    ],
  },

  "how-to-find-the-right-job": {
    category: "JOB SEARCH",
    title: "How to Find the Right Job",
    intro:
      "Finding the right opportunity becomes easier when you understand what you are looking for and approach your search systematically.",
    sections: [
      {
        heading: "Understand what you want",
        paragraphs: [
          "Start by considering the type of work, location, qualification requirements and career direction that suit you.",
        ],
      },
      {
        heading: "Match opportunities with your skills",
        paragraphs: [
          "Look beyond the job title. Read the responsibilities and requirements carefully to understand whether the opportunity matches your current abilities.",
        ],
      },
      {
        heading: "Keep your applications relevant",
        paragraphs: [
          "A tailored resume and thoughtful application can communicate your interest more effectively than sending the same application everywhere.",
        ],
      },
      {
        heading: "Be consistent",
        paragraphs: [
          "Job searching can take time. Keep improving your skills, applying to relevant opportunities and learning from each experience.",
        ],
      },
    ],
  },

  "how-to-prepare-for-your-next-interview": {
    category: "INTERVIEW GUIDE",
    title: "How to Prepare for Your Next Interview",
    intro:
      "Good preparation can help you communicate more confidently and make a stronger impression during an interview.",
    sections: [
      {
        heading: "Research the opportunity",
        paragraphs: [
          "Understand the role, responsibilities and organisation before your interview. This helps you give more relevant answers.",
        ],
      },
      {
        heading: "Prepare your introduction",
        paragraphs: [
          "Be ready to explain who you are, what you have worked on and why you are interested in the opportunity.",
        ],
      },
      {
        heading: "Think about examples",
        paragraphs: [
          "Prepare examples that demonstrate your skills, problem-solving ability, teamwork and willingness to learn.",
        ],
      },
      {
        heading: "Ask thoughtful questions",
        paragraphs: [
          "An interview is also an opportunity for you to understand the role. Prepare a few genuine questions about the work and expectations.",
        ],
      },
    ],
  },

  "what-employers-look-for-in-candidates": {
    category: "CAREER GUIDE",
    title: "What Employers Look For in Candidates",
    intro:
      "While requirements vary between roles, several qualities can help candidates stand out during the hiring process.",
    sections: [
      {
        heading: "Relevant skills",
        paragraphs: [
          "Employers want to know whether you can handle the responsibilities of the role. Highlight skills that are directly relevant to the opportunity.",
        ],
      },
      {
        heading: "Reliability",
        paragraphs: [
          "Being dependable, organised and responsible can be just as important as technical ability.",
        ],
      },
      {
        heading: "Willingness to learn",
        paragraphs: [
          "For candidates who are early in their careers, curiosity and a willingness to improve can be valuable strengths.",
        ],
      },
      {
        heading: "Professional communication",
        paragraphs: [
          "Clear communication throughout the application and interview process can demonstrate professionalism and confidence.",
        ],
      },
    ],
  },

  "common-job-search-mistakes-to-avoid": {
    category: "JOB SEARCH",
    title: "Common Job Search Mistakes to Avoid",
    intro:
      "A few common mistakes can make a job search unnecessarily difficult. Understanding them can help you approach opportunities more effectively.",
    sections: [
      {
        heading: "Applying without reading the requirements",
        paragraphs: [
          "Take time to understand what an employer is actually looking for before applying.",
        ],
      },
      {
        heading: "Using the same resume everywhere",
        paragraphs: [
          "Different roles may require different skills. Adjust your resume so the most relevant experience is easy to identify.",
        ],
      },
      {
        heading: "Ignoring presentation",
        paragraphs: [
          "Typos, inconsistent formatting and unclear information can make an otherwise strong application look less professional.",
        ],
      },
      {
        heading: "Giving up too early",
        paragraphs: [
          "Rejection is a normal part of the job search. Use feedback and experience from applications to improve your next attempt.",
        ],
      },
    ],
  },
} as const;

type ArticleSlug = keyof typeof articles;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(slug in articles)) {
    notFound();
  }

  const article = articles[slug as ArticleSlug];

  return (
    <>
      <main className="content-page">
        <div className="container">
          <Link href="/blogs" className="article-link">
            ← Back to Career Insights
          </Link>

          <div style={{ marginTop: "28px" }}>
            <p className="eyebrow">{article.category}</p>

            <h1>{article.title}</h1>

            <p className="page-intro">{article.intro}</p>
          </div>

          <div>
            {article.sections.map((section) => (
              <section className="content-section" key={section.heading}>
                <h2>{section.heading}</h2>

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} style={{ marginTop: "10px" }}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="contact-card">
            <h2>Looking for opportunities?</h2>

            <p>
              Explore Jobsera's latest opportunities and take the next step
              in your career.
            </p>

            <Link href="/jobs" className="button button-primary" style={{ marginTop: "18px" }}>
              Explore Jobs
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

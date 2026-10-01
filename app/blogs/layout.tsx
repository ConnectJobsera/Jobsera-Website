import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Insights",
  description:
    "Career articles, exam preparation tips and job-search guidance from Jobsera.",
  alternates: { canonical: "https://www.thejobsera.com/blogs" },
  openGraph: {
    title: "Career Insights | Jobsera",
    description:
      "Career articles, exam preparation tips and job-search guidance from Jobsera.",
    url: "https://www.thejobsera.com/blogs",
    type: "website",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

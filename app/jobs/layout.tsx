import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description:
    "Browse the latest job opportunities on Jobsera, filterable by qualification, location and more.",
  alternates: { canonical: "https://www.thejobsera.com/jobs" },
  openGraph: {
    title: "Browse Jobs | Jobsera",
    description:
      "Browse the latest job opportunities on Jobsera, filterable by qualification, location and more.",
    url: "https://www.thejobsera.com/jobs",
    type: "website",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobsera — Jobs & Career Opportunities",
  description:
    "Discover jobs, career opportunities, and useful career content with Jobsera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

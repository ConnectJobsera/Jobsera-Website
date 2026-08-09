import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "Jobsera | Your Career Starts Here",
  description:
    "Discover job opportunities, career insights and useful resources with Jobsera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main>{children}</main>

        <footer className="site-footer">
  <div className="footer-inner">

    {/* Logo */}
    <div className="footer-brand">
      <img
        src="/jobsera-logo.PNG"
        alt="Jobsera"
        className="footer-logo"
      />

      <div className="footer-red-line"></div>
    </div>

    {/* Navigation Links */}
    <nav className="footer-links">

      <div className="footer-link-group">
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
      </div>

      <div className="footer-link-group">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms &amp; Conditions</a>
      </div>

    </nav>

    {/* Gmail */}
    <a
      href="mailto:connectjobsera@gmail.com"
      className="footer-email"
    >
      <span className="footer-email-icon" aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 6.5L12 13L21 6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </span>

      <span>connectjobsera@gmail.com</span>
    </a>

    {/* Copyright */}
    <div className="footer-bottom">
      <p>ⓘ 2026 Jobsera. All Rights are Reserved.</p>
    </div>

  </div>
</footer>
      </body>
    </html>
  );
}

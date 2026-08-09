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

    <div className="footer-brand">
      <img
        src="/jobsera-logo.PNG"
        alt="Jobsera"
        className="footer-logo"
      />

      <div className="footer-line"></div>
    </div>

    <nav className="footer-links" aria-label="Footer navigation">
      <a href="/about">About Us</a>
      <a href="/contact">Contact Us</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms & Conditions</a>
    </nav>

    <a
      href="mailto:connectjobsera@gmail.com"
      className="footer-email"
    >
      <span className="gmail-icon" aria-hidden="true">
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
            strokeWidth="2"
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
            strokeWidth="2"
          />
        </svg>
      </span>

      <span>connectjobsera@gmail.com</span>
    </a>

    <div className="footer-bottom">
      <span>ⓘ 2026 Jobsera. All Rights are Reserved.</span>
    </div>

  </div>
</footer>
      </body>
    </html>
  );
}

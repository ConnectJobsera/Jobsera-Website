import Link from "next/link";

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" aria-label="Jobsera home">
            <img
              src="/jobsera-logo.PNG"
              alt="Jobsera"
              className="footer-logo"
            />
          </Link>

          <div className="footer-line" aria-hidden="true" />
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href="mailto:connectjobsera@gmail.com"
          className="footer-email"
        >
          <span className="gmail-icon" aria-hidden="true">
            <svg
              width="20"
              height="16"
              viewBox="0 0 20 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 1.5H18C18.5523 1.5 19 1.94772 19 2.5V13.5C19 14.0523 18.5523 14.5 18 14.5H2C1.44772 14.5 1 14.0523 1 13.5V2.5C1 1.94772 1.44772 1.5 2 1.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M2 3L10 9L18 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span>connectjobsera@gmail.com</span>
        </a>

        <div className="footer-bottom">
          © 2026 Jobsera. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

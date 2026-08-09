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
          <div className="container footer-inner">
            <div className="footer-brand">
              <img
                src="/jobsera-logo.PNG"
                alt="Jobsera"
                className="footer-logo"
              />

              <p>
                Career knowledge and opportunities that matter.
              </p>
            </div>

            <div className="footer-links">
              <a href="/about">About Us</a>
              <a href="/contact">Contact Us</a>
              <a href="/terms">Terms & Conditions</a>
              <a href="/privacy">Privacy Policy</a>
            </div>

            <div className="footer-bottom">
              <span>© 2026 Jobsera</span>

              <a href="mailto:connectjobsera@gmail.com">
                connectjobsera@gmail.com
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

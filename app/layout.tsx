import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getLang } from "../lib/lang";

const siteUrl = "https://www.thejobsera.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jobsera | Your Career Starts Here",
    template: "%s | Jobsera",
  },
  description:
    "Discover job opportunities, career insights and useful resources with Jobsera.",
  openGraph: {
    siteName: "Jobsera",
    type: "website",
    url: siteUrl,
    title: "Jobsera | Your Career Starts Here",
    description:
      "Discover job opportunities, career insights and useful resources with Jobsera.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobsera | Your Career Starts Here",
    description:
      "Discover job opportunities, career insights and useful resources with Jobsera.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={lang}>
      <body>
        <Header lang={lang} />

        <main>{children}</main>

        <Footer />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BS57H1J7VP"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BS57H1J7VP');
          `}
        </Script>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LanguageToggle from "./LanguageToggle";
import { dictionary, type Lang } from "../lib/lang";

export default function Header({ lang = "en" }: { lang?: Lang }) {
  const copy = dictionary[lang];

  const menuItems = [
    { label: "Home", href: "/" },
    { label: copy.nav_jobs, href: "/jobs" },
    { label: copy.nav_blogs, href: "/blogs" },
    { label: copy.nav_about, href: "/about" },
    { label: copy.nav_contact, href: "/contact" },
    { label: copy.nav_terms, href: "/terms" },
    { label: copy.nav_privacy, href: "/privacy" },
  ];

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const pathname = usePathname();
  const router = useRouter();

  const showHeaderSearch =
    pathname === "/";

  function handleSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      router.push("/jobs");
      setMenuOpen(false);
      return;
    }

    router.push(
      `/jobs?search=${encodeURIComponent(query)}`
    );

    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="logo-link"
          aria-label="Jobsera home"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          <img
            src="/jobsera-logo.PNG"
            alt="Jobsera"
            className="logo-image"
          />
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          <Link
            href="/jobs"
            className={
              pathname.startsWith("/jobs")
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            {copy.nav_jobs}
          </Link>

          <Link
            href="/blogs"
            className={
              pathname.startsWith("/blogs")
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            {copy.nav_blogs}
          </Link>

          <Link
            href="/about"
            className={
              pathname === "/about"
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            {copy.nav_about}
          </Link>

          <Link
            href="/contact"
            className={
              pathname === "/contact"
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            {copy.nav_contact}
          </Link>
        </nav>

        <div className="header-actions">
          {showHeaderSearch && (
            <form
              className="header-search"
              onSubmit={handleSearch}
              role="search"
            >
              <svg
                className="header-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="m16 16 5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={copy.search_placeholder}
                aria-label="Search jobs"
              />
            </form>
          )}

          <LanguageToggle
            lang={lang}
            label={copy.lang_toggle_label}
          />

          <Link
            href="/admin/login"
            className="header-login"
          >
            {copy.nav_login}
          </Link>

          <div className="header-menu-wrapper">
            <button
              type="button"
              className="menu-button"
              aria-label={
                menuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="jobsera-navigation"
              onClick={() =>
                setMenuOpen(
                  (open) => !open
                )
              }
            >
              <span
                className="menu-icon"
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </span>
            </button>

            {menuOpen && (
              <nav
                id="jobsera-navigation"
                className="mobile-menu"
                aria-label="More navigation"
              >
                {menuItems.map(
                  (item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

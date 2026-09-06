"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Career Insights", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Header() {
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
            Jobs
          </Link>

          <Link
            href="/blogs"
            className={
              pathname.startsWith("/blogs")
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            Career Insights
          </Link>

          <Link
            href="/about"
            className={
              pathname === "/about"
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            About
          </Link>

          <Link
            href="/contact"
            className={
              pathname === "/contact"
                ? "nav-link nav-link-active"
                : "nav-link"
            }
          >
            Contact
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
                placeholder="Search jobs..."
                aria-label="Search jobs"
              />
            </form>
          )}

          <Link
            href="/admin/login"
            className="header-login"
          >
            Login
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

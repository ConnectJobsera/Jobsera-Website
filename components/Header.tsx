"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Jobs", href: "/jobs" },
  { label: "Career Insights", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      router.push("/jobs");
      return;
    }

    router.push(
      `/jobs?search=${encodeURIComponent(query)}`
    );

    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/jobs") {
      return pathname === "/jobs" || pathname.startsWith("/jobs/");
    }

    if (href === "/blogs") {
      return pathname === "/blogs" || pathname.startsWith("/blogs/");
    }

    return pathname === href;
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* =========================
            LOGO
        ========================== */}
        <Link
          href="/"
          className="brand"
          aria-label="Jobsera Home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">J</span>

          <span className="brand-text">
            Jobsera
          </span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href)
                  ? "nav-link nav-link-active"
                  : "nav-link"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* =========================
            HEADER ACTIONS
        ========================== */}
        <div className="header-actions">
          <form
            className="header-search"
            onSubmit={handleSearch}
            role="search"
          >
            <svg
              className="header-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
                d="m16 16 4.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search jobs..."
              aria-label="Search jobs"
            />
          </form>

          <Link
            href="/login"
            className="header-login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

          <button
            type="button"
            className={
              menuOpen
                ? "menu-toggle menu-toggle-open"
                : "menu-toggle"
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================== */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="container mobile-menu-inner">
            <form
              className="mobile-search"
              onSubmit={handleSearch}
              role="search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
                  d="m16 16 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search jobs..."
                aria-label="Search jobs"
              />

              <button type="submit">
                Search
              </button>
            </form>

            <nav
              className="mobile-nav"
              aria-label="Mobile navigation"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive(item.href)
                      ? "mobile-nav-link mobile-nav-link-active"
                      : "mobile-nav-link"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>

                  <span aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}

              <Link
                href="/login"
                className="mobile-login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

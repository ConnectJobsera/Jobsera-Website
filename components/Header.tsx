"use client";

import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="logo-link"
          aria-label="Jobsera home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/jobsera-logo.PNG"
            alt="Jobsera"
            className="logo-image"
          />
        </Link>

        <div className="header-menu-wrapper">
          <button
            type="button"
            className="menu-button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="jobsera-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          {menuOpen && (
            <nav
              id="jobsera-navigation"
              className="mobile-menu"
              aria-label="Main navigation"
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

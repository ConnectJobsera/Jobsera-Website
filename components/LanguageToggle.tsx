"use client";

import { LANG_COOKIE, type Lang } from "../lib/lang";

export default function LanguageToggle({
  lang,
  label,
}: {
  lang: Lang;
  label: string;
}) {
  function toggle() {
    const next: Lang = lang === "en" ? "hi" : "en";

    // 1 year, root path, so every page reads the same choice.
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000`;

    // A full reload (rather than router.refresh()) guarantees every page —
    // including fully client-rendered ones like the jobs listing, which
    // fetch their own data and read the cookie on mount — picks up the new
    // language immediately and consistently.
    window.location.reload();
  }

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label="Switch language"
    >
      {label}
    </button>
  );
}

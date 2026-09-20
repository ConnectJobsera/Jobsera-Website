"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "../lib/lang";

export default function LanguageToggle({
  lang,
  label,
}: {
  lang: Lang;
  label: string;
}) {
  const router = useRouter();

  function toggle() {
    const next: Lang = lang === "en" ? "hi" : "en";

    // 1 year, root path, so every page reads the same choice.
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000`;

    router.refresh();
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

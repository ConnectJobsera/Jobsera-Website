import { LANG_COOKIE, type Lang } from "./lang";

// Browser-only: read the current language straight from document.cookie.
// Used by client components (like the jobs listing page) that fetch their
// own data and can't use the server-only getLang() from lib/get-lang.ts.
export function getClientLang(): Lang {
  if (typeof document === "undefined") {
    return "en";
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]*)`)
  );

  return match && match[1] === "hi" ? "hi" : "en";
}

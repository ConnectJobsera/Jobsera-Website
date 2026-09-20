import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./lang";

// Server-side only: read the visitor's chosen language from the cookie.
// Kept in its own file (separate from lib/lang.ts) because it imports
// "next/headers", which cannot be bundled into any file a Client Component
// imports — even indirectly. lib/lang.ts stays client-safe; this file is
// only ever imported from Server Components (e.g. app/layout.tsx).
export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANG_COOKIE)?.value;

  return value === "hi" ? "hi" : "en";
}

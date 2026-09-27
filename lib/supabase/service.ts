import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role Supabase client — for trusted, server-only operations that
// should bypass RLS entirely (e.g. writing to translations_cache on the
// visitor's behalf). NEVER import this file from a Client Component or
// anywhere that could end up in browser JS: the service role key grants
// full database access with no RLS restrictions.
//
// Requires SUPABASE_SERVICE_ROLE_KEY (server-only env var, no NEXT_PUBLIC_
// prefix) — get it from Supabase → Project Settings → API → service_role
// key (the "secret" one, not the publishable one).
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

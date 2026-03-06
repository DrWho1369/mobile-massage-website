import "server-only";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getAdminEnv(): { url: string; serviceKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase admin env (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY). Check .env.local."
    );
  }
  return { url, serviceKey };
}

let adminClient: SupabaseClient | null = null;

/**
 * Supabase client with service role. Use only in Server Components or Server Actions.
 * Throws if env vars are missing.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    const { url, serviceKey } = getAdminEnv();
    adminClient = createClient(url, serviceKey, {
      auth: { persistSession: false }
    });
  }
  return adminClient;
}

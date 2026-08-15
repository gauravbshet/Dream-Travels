import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertServerSupabaseEnv() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            "Missing required Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
    }
}

import { Database } from "@/types/database.types";

export function createServerSupabaseClient() {
    assertServerSupabaseEnv();

    return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
        cookies: {
            getAll: async () =>
                (await cookies()).getAll().map((cookie) => ({ name: cookie.name, value: cookie.value })),
            setAll: async () => {
                // Cookie setting is only supported in Next.js Route Handlers or Server Actions.
                // For normal server component rendering, do not attempt to write cookies here.
            },
        },
    });
}

/**
 * Anonymous, cookie-free client for public catalogue reads (destinations,
 * packages, reviews — anything an unauthenticated visitor can see).
 *
 * Why this exists: `createServerSupabaseClient` reads `cookies()`, and any
 * route that touches cookies is forced into per-request dynamic rendering, so
 * `export const revalidate` on those pages silently does nothing. Reading
 * public data through this client instead lets those pages actually cache.
 *
 * It is also the safer client for a cached page: rendering with a
 * session-bound client and then caching that HTML would serve one visitor's
 * personalised output to everyone. This client only ever sees what an
 * anonymous visitor sees, so a shared cache entry is correct by construction.
 *
 * Do NOT use it for anything auth-dependent (dashboard, admin, bookings) — it
 * carries no session, so RLS treats every call as anonymous.
 */
let publicSupabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function createPublicSupabaseClient() {
    assertServerSupabaseEnv();

    if (!publicSupabaseInstance) {
        publicSupabaseInstance = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }

    return publicSupabaseInstance;
}

let adminSupabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminSupabaseClient() {
    const key = supabaseServiceRoleKey ?? supabaseAnonKey;

    if (!key) {
        throw new Error("Missing Supabase service role key for admin operations.");
    }

    if (!supabaseUrl) {
        throw new Error("Missing required Supabase environment variable NEXT_PUBLIC_SUPABASE_URL.");
    }

    if (!adminSupabaseInstance) {
        adminSupabaseInstance = createClient<Database>(supabaseUrl, key);
    }

    return adminSupabaseInstance;
}

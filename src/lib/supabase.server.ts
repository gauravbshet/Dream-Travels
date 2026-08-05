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

export function createServerSupabaseClient() {
    assertServerSupabaseEnv();

    return createServerClient(supabaseUrl!, supabaseAnonKey!, {
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

export function createAdminSupabaseClient() {
    const key = supabaseServiceRoleKey ?? supabaseAnonKey;

    if (!key) {
        throw new Error("Missing Supabase service role key for admin operations.");
    }

    if (!supabaseUrl) {
        throw new Error("Missing required Supabase environment variable NEXT_PUBLIC_SUPABASE_URL.");
    }

    return createClient(supabaseUrl, key);
}

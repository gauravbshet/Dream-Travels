import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertBrowserSupabaseEnv() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            "Missing required Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
        );
    }
}

import { Database } from "@/types/database.types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createBrowserSupabaseClient() {
    assertBrowserSupabaseEnv();
    if (!browserClient) {
        browserClient = createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
    }
    return browserClient;
}

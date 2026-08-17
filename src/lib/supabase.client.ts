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

// Singleton: every caller (Navbar, WishlistButton -- mounted once per
// package/destination card, so many times per page -- and the admin
// components) must share ONE browser client instance. A fresh
// createBrowserClient() per call spins up a fresh GoTrueClient with its own
// auto-refresh timer and, for callers that also call onAuthStateChange, its
// own listener. With many components each creating their own client, those
// timers race to refresh the same cookie-backed session concurrently --
// Supabase's refresh-token rotation invalidates whichever call loses the
// race, which fires spurious SIGNED_OUT/TOKEN_REFRESHED events on every
// listener and re-triggers every onAuthStateChange-driven fetch
// (getUser/profiles/wishlists) across every mounted instance at once. That
// is the request storm (and resulting client-side session churn) this
// singleton fixes.
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createBrowserSupabaseClient() {
    assertBrowserSupabaseEnv();
    if (!browserClient) {
        browserClient = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
    }
    return browserClient;
}

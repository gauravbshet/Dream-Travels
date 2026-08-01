export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

async function requireAdmin() {
    const supabase = createServerSupabaseClient();
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
        redirect("/login");
    }

    const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (profileData?.role !== "admin") {
        redirect("/dashboard");
    }

    return session.user;
}

export default async function AdminPage() {
    const user = await requireAdmin();

    return (
        <main className="flex-1 bg-surface pt-16 lg:pt-20">
            <AdminDashboard userEmail={user.email} />
        </main>
    );
}

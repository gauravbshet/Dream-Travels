export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

async function requireAdmin() {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileData = data as any;

    if (profileData?.role !== "admin") {
        redirect("/dashboard");
    }

    return user;
}

export default async function AdminPage() {
    const user = await requireAdmin();

    return (
        <main className="flex-1 bg-admin-bg">
            <AdminDashboard userEmail={user.email} />
        </main>
    );
}

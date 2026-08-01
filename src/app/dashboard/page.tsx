export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

async function getUserData() {
    const supabase = createServerSupabaseClient();
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
        redirect("/login");
    }

    const user = session.user;

    const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileData?.role === "admin") {
        redirect("/admin");
    }

    const { data: wishlistData } = await supabase
        .from("wishlists")
        .select("id,package_id,packages(title,slug,price,image,duration)")
        .eq("user_id", user.id);

    return {
        user,
        wishlist: wishlistData ?? [],
    };
}

export default async function DashboardPage() {
    const { user, wishlist } = await getUserData();

    return (
        <main className="flex-1 py-20">
            <Container>
                <SectionHeading
                    eyebrow="Welcome back"
                    title={`Hi, ${user.user_metadata?.full_name ?? user.email ?? "Traveller"}`}
                    emoji="👋"
                    description="Your profile, saved packages, and wishlist are waiting for you."
                />

                <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                    <div className="rounded-[32px] border border-black/[0.08] bg-white p-8 shadow-soft">
                        <h3 className="text-xl font-semibold text-ink">Profile</h3>
                        <div className="mt-6 space-y-3 text-ink/80">
                            <p>
                                <span className="font-semibold text-ink">Name:</span>{" "}
                                {user.user_metadata?.full_name ?? "—"}
                            </p>
                            <p>
                                <span className="font-semibold text-ink">Email:</span>{" "}
                                {user.email}
                            </p>
                            <p>
                                <span className="font-semibold text-ink">User ID:</span>{" "}
                                {user.id}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-black/[0.08] bg-white p-8 shadow-soft">
                        <h3 className="text-xl font-semibold text-ink">Wishlist</h3>
                        <p className="mt-2 text-sm text-ink/60">
                            Review the packages you saved and open the details page to book.
                        </p>
                        <div className="mt-6 space-y-4">
                            {wishlist.length === 0 ? (
                                <p className="text-ink/60">You don&apos;t have any saved packages yet.</p>
                            ) : (
                                wishlist.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="rounded-3xl border border-black/[0.05] bg-surface p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-ink/50">Saved package</p>
                                                <h4 className="mt-1 text-lg font-semibold text-ink">
                                                    {item.packages?.title}
                                                </h4>
                                                <p className="mt-1 text-sm text-ink/60">
                                                    {item.packages?.duration}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-ink/45">Price</p>
                                                <p className="mt-1 text-lg font-semibold text-ink">
                                                    {formatPrice(item.packages?.price ?? 0)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <Link
                                                href={`/packages/${item.packages?.slug}`}
                                                className="text-sm font-semibold text-primary hover:underline"
                                            >
                                                View package
                                            </Link>
                                            <button
                                                type="button"
                                                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink transition hover:bg-ink/5"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </Container>
        </main>
    );
}

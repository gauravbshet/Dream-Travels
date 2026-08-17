export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary";
import { RemoveWishlistButton } from "./RemoveWishlistButton";

type WishlistItem = {
    id: string;
    package_id: string;
    packages: {
        title: string;
        slug: string;
        price: number;
        image: string | null;
        duration: string | null;
    } | null;
};

async function getUserData() {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    // Cast needed: the Supabase client has no generated Database type, so
    // TypeScript infers query results as `never` instead of the real row
    // shape. See supabase_schema.md — generating types would remove this.
    const profile = profileData as { role: string | null } | null;

    if (profile?.role === "admin") {
        redirect("/admin");
    }

    const { data: wishlistData } = await supabase
        .from("wishlists")
        .select("id,package_id,packages(title,slug,price,image,duration)")
        .eq("user_id", user.id);

    return {
        user,
        wishlist: (wishlistData ?? []) as unknown as WishlistItem[],
    };
}

export default async function DashboardPage() {
    const { user, wishlist } = await getUserData();

    return (
        <main data-tone="light" className="flex-1 bg-canvas pt-24 sm:pt-28 lg:pt-32 pb-12">
            <Container>
                <SectionHeading
                    title={`Hi, ${user.user_metadata?.full_name ?? user.email ?? "Traveller"}`}
                    description="Your profile, saved packages, and wishlist are waiting for you."
                />

                <section className="grid gap-8 lg:grid-cols-2">
                    <div className="rounded-[24px] border border-border bg-surface p-8 sm:p-10">
                        <h3 className="text-xl font-semibold text-ink">Profile</h3>
                        <div className="mt-6 space-y-3 text-ink/85">
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

                    <div className="rounded-[24px] border border-border bg-surface p-8">
                        <h3 className="text-xl font-semibold text-ink">Wishlist</h3>
                        <p className="mt-2 text-sm text-text-secondary">
                            Review the packages you saved and open the details page to book.
                        </p>
                        <div className="mt-6 space-y-4">
                            {wishlist.length === 0 ? (
                                <p className="text-ink/60">You don&apos;t have any saved packages yet.</p>
                            ) : (
                                wishlist.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-[16px] border border-border bg-sage-100/60 p-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Thumbnail */}
                                            {item.packages?.image && (
                                                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[10px]">
                                                    <Image
                                                        src={cldUrl(item.packages.image, 200)}
                                                        alt={item.packages.title ?? "Package"}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-1 items-start justify-between gap-2">
                                                <div>
                                                    <p className="text-sm text-text-secondary">Saved package</p>
                                                    <h4 className="mt-1 text-base font-semibold text-ink">
                                                        {item.packages?.title}
                                                    </h4>
                                                    <p className="mt-0.5 text-sm text-text-secondary">
                                                        {item.packages?.duration}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm text-text-secondary">Price</p>
                                                    <p className="mt-1 text-base font-semibold text-ink">
                                                        {formatPrice(item.packages?.price ?? 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <Link
                                                href={`/packages/${item.packages?.slug}`}
                                                className="text-sm font-semibold text-primary hover:underline"
                                            >
                                                View package
                                            </Link>
                                            <RemoveWishlistButton wishlistId={item.id} />
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

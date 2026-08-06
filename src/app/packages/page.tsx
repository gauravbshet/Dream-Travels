export const dynamic = "force-dynamic";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { PackageCard } from "@/components/cards/PackageCard";
import type { Package } from "@/data/packages";

async function getPackages(): Promise<Package[]> {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
        .from("packages")
        .select("id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id")
        .eq("status", "published")
        .order("created_at", { ascending: false });

    return (data ?? []).map((pkg) => ({
        ...pkg,
        location: pkg.location ?? "",
        category: pkg.category ?? "Trip",
        duration: pkg.duration ?? "",
        pickup: pkg.pickup ?? "",
        dates: pkg.dates ?? "Flexible",
        rating: pkg.rating ?? 0,
        reviews: pkg.reviews ?? 0,
    }));
}

export default async function PackagesListPage() {
    const packages = await getPackages();

    return (
        <main data-tone="light" className="flex-1 bg-canvas py-16">
            <Container>
                <SectionHeading
                    title="All packages"
                    description="Browse every curated trip currently open for booking."
                />

                {packages.length === 0 ? (
                    <p className="mt-10 text-center text-sm text-ink-muted">
                        No packages are published yet — check back soon.
                    </p>
                ) : (
                    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {packages.map((pkg) => (
                            <PackageCard key={pkg.id} pkg={pkg} className="w-full" />
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}

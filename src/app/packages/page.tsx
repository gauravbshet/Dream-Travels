export const dynamic = "force-dynamic";

import Link from "next/link";
import { X } from "lucide-react";
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
        .order("display_order", { ascending: true })
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

export default async function PackagesListPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; guests?: string; maxPrice?: string }>;
}) {
    const params = await searchParams;
    const allPackages = await getPackages();
    const query = params?.q?.toLowerCase().trim();
    const category = params?.category?.toLowerCase().trim();
    const maxPrice = params?.maxPrice ? Number(params.maxPrice) : undefined;
    const isValidMaxPrice = typeof maxPrice === "number" && Number.isFinite(maxPrice);

    const filteredPackages = allPackages.filter((pkg) => {
        let matchesQuery = true;
        let matchesCategory = true;
        let matchesBudget = true;

        if (query) {
            matchesQuery =
                pkg.title.toLowerCase().includes(query) ||
                pkg.location.toLowerCase().includes(query) ||
                pkg.category.toLowerCase().includes(query);
        }

        if (category && category !== "all types") {
            matchesCategory = pkg.category.toLowerCase().includes(category);
        }

        if (isValidMaxPrice) {
            matchesBudget = pkg.price <= maxPrice;
        }

        return matchesQuery && matchesCategory && matchesBudget;
    });

    const isFiltered = Boolean(query || (category && category !== "all types") || isValidMaxPrice);

    return (
        <main data-tone="light" className="flex-1 bg-canvas pt-24 sm:pt-28 lg:pt-32 pb-12">
            <Container>
                <SectionHeading
                    title={isFiltered ? "Search Results" : "All packages"}
                    description={
                        isFiltered
                            ? `Showing trips matching your search criteria.`
                            : "Browse every curated trip currently open for booking."
                    }
                />

                {isFiltered && (
                    <div className="mt-4 flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-canopy/10 px-4 py-1.5 text-xs font-bold text-canopy border border-canopy/20">
                            {[
                                query ? `Search: "${params.q}"` : null,
                                category ? `Category: ${params.category}` : null,
                                isValidMaxPrice && maxPrice !== undefined ? `Under ₹${maxPrice.toLocaleString("en-IN")}` : null,
                            ]
                                .filter(Boolean)
                                .join(" • ")}
                        </span>
                        <Link
                            href="/packages"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
                        >
                            <X className="h-3.5 w-3.5" /> Clear Filters
                        </Link>
                    </div>
                )}

                {filteredPackages.length === 0 ? (
                    <div className="mt-10 text-center py-12 rounded-[20px] border border-border bg-surface p-8">
                        <p className="text-base font-bold text-ink">No matching packages found</p>
                        <p className="mt-1 text-sm text-ink-muted">
                            Try searching for a different destination or category.
                        </p>
                        <Link
                            href="/packages"
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-canopy px-5 py-2 text-xs font-bold text-white hover:bg-canopy-hover transition-colors"
                        >
                            View All Packages
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {filteredPackages.map((pkg) => (
                            <PackageCard key={pkg.id} pkg={pkg} className="w-full" />
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
}

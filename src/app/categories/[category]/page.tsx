export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageCard } from "@/components/cards/PackageCard";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { categoryLabels, isCategorySlug, type CategorySlug } from "@/data/categories";
import type { Package } from "@/data/packages";

async function getPackagesByCategory(category: CategorySlug): Promise<Package[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id"
    )
    .eq("status", "published")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((pkg) => ({
    ...pkg,
    location: pkg.location ?? "",
    category: pkg.category ?? category,
    duration: pkg.duration ?? "",
    pickup: pkg.pickup ?? "",
    dates: pkg.dates ?? "Flexible",
    rating: pkg.rating ?? 0,
    reviews: pkg.reviews ?? 0,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isCategorySlug(category)) {
    notFound();
  }

  const label = categoryLabels[category];
  const packages = await getPackagesByCategory(category);

  return (
    <main data-tone="light" className="flex-1 bg-canvas py-16">
      <Container>
        <SectionHeading
          title={`Explore ${label}`}
          description={`Curated ${label.toLowerCase()} picked for you — browse and book directly.`}
        />

        {packages.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-muted">
            No packages are available under {label.toLowerCase()} yet — check back soon.
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

// Cached for 5 minutes rather than rendered per request. Catalogue content
// changes rarely, so serving every visitor a fresh Supabase round-trip was
// pure waste. Admin edits appear within 5 minutes.
export const revalidate = 300;

import { notFound } from "next/navigation";
import { Sparkles, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageCard } from "@/components/cards/PackageCard";
import { createPublicSupabaseClient } from "@/lib/supabase.server";
import { categories, categoryLabels, isCategorySlug, type CategorySlug } from "@/data/categories";
import { packages as staticPackages, type Package } from "@/data/packages";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// The category set is a fixed, known list, so prerender all four at build
// time instead of rendering each on first request. Anything outside the list
// is rejected by `isCategorySlug` below and 404s.
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

// Cast needed below: the Supabase client has no generated Database type, so
// TypeScript infers query results as `never` instead of the real row shape.
// See supabase_schema.md — generating types would remove this.
type CategoryPackageRow = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  image: string | null;
  category: string | null;
  duration: string | null;
  pickup: string | null;
  dates: string | null;
  rating: number | null;
  reviews: number | null;
  price: number;
  original_price: number | null;
  destination_id: string | null;
};

async function getPackagesByCategory(category: CategorySlug): Promise<Package[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data: rawData } = await supabase
      .from("packages")
      .select(
        "id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id"
      )
      .eq("status", "published")
      .eq("category", category)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    const data = rawData as CategoryPackageRow[] | null;

    return (data ?? []).map((pkg) => ({
      ...pkg,
      location: pkg.location ?? "",
      category: pkg.category ?? category,
      duration: pkg.duration ?? "",
      pickup: pkg.pickup ?? "",
      dates: pkg.dates ?? "Flexible",
      rating: pkg.rating ?? 0,
      reviews: pkg.reviews ?? 0,
      original_price: pkg.original_price ?? undefined,
      destination_id: pkg.destination_id ?? undefined,
      image: pkg.image ?? "",
    }));
  } catch (err) {
    console.error("Error fetching category packages from Supabase:", err);
    return [];
  }
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
    <main data-tone="light" className="flex-1 bg-canvas pt-24 sm:pt-28 lg:pt-32 pb-12">
      <Container>
        <SectionHeading
          title={`Explore ${label}`}
          description={
            category === "international"
              ? "Handpicked international group expeditions launching soon — pre-register to get early bird access."
              : `Curated ${label.toLowerCase()} picked for you — browse and book directly.`
          }
        />

        {category === "international" && (
          <div className="mt-6 rounded-[24px] border border-amber-200/80 bg-amber-50/60 p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300/40">
                  <Sparkles className="h-3.5 w-3.5" /> Coming Soon
                </span>
                <h2 className="mt-3 text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  International Packages Launching Soon!
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl">
                  We are finalizing flight partnerships and luxury stays for our upcoming international group packages (Bali, Thailand, Dubai & Vietnam). Get notified on WhatsApp for priority booking alerts.
                </p>
              </div>
              <a
                href={buildWhatsAppLink(
                  "Hello Dream Travels! Please notify me as soon as International Packages open for booking."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-canopy hover:bg-canopy-hover px-5 py-3 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
              >
                <MessageSquare className="h-4 w-4" /> Get Notified on WhatsApp
              </a>
            </div>
          </div>
        )}

        {packages.length === 0 ? (
          category === "international" ? null : (
            <div className="mt-10 text-center py-16 px-6 rounded-[24px] border border-border bg-surface shadow-2xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-canopy/10 px-3.5 py-1 text-xs font-bold text-canopy border border-canopy/20">
                <Sparkles className="h-3.5 w-3.5" /> Coming Soon
              </span>
              <h3 className="mt-4 text-xl font-bold text-ink">New {label} Coming Soon!</h3>
              <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
                No packages are currently open under {label.toLowerCase()}. Check back soon or contact our travel team on WhatsApp to request a custom itinerary!
              </p>
              <a
                href={buildWhatsAppLink(
                  `Hello Dream Travels! I'm interested in booking a ${label} trip.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-canopy hover:bg-canopy-hover px-5 py-2.5 text-xs font-bold text-white transition-all shadow-xs"
              >
                <MessageSquare className="h-4 w-4" /> Request Custom {label} Trip
              </a>
            </div>
          )
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

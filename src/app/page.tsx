import { Hero } from "@/components/sections/Hero";
import { PopularDestinationsGrid } from "@/components/sections/PopularDestinationsGrid";
import { FeaturedPackagesGrid } from "@/components/sections/FeaturedPackagesGrid";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ReviewCarousel } from "@/components/sections/ReviewCarousel";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { CategorySlider } from "@/components/sections/CategorySlider";
import { ExploreByMap } from "@/components/sections/ExploreByMap";
import { BudgetCards } from "@/components/sections/BudgetCards";
import { Statistics } from "@/components/sections/Statistics";
import { PopularExperiences } from "@/components/sections/PopularExperiences";
import { ReelsShowcase } from "@/components/sections/ReelsShowcase";
import { heroBadge } from "@/data/site";
import { createPublicSupabaseClient } from "@/lib/supabase.server";
import { Destination, MasonryDestination, BudgetTier } from "@/data/destinations";
import { Package } from "@/data/packages";
import { reels as staticReels, type Reel } from "@/data/reels";
import {
  recommendedDestinations,
  interestingDestinations as staticInterestingDestinations,
  budgetTiers as staticBudgetTiers,
  popularExperiences as staticExperiences,
} from "@/data/destinations";
import { packages as staticPackages, topPicks as staticTopPicks } from "@/data/packages";
import { reviews as staticReviews, type Review } from "@/data/reviews";
import type { PopularExperience } from "@/data/destinations";
import { mapDestinations as staticMapDestinations, type MapDestination, type Region } from "@/data/map";

const MAP_REGIONS = new Set<Region>(["Himalayas", "Northeast", "West Coast", "Western Ghats", "Islands"]);

// Cached for 5 minutes rather than rendered per request. This page fires
// eleven Supabase queries; under `force-dynamic` every visitor paid for all
// of them. Trip content changes rarely, so a short revalidate window is the
// right trade — an admin edit appears within 5 minutes.
export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamtravels.com";

// No `aggregateRating` here on purpose. Google requires that a published
// aggregateRating reflect genuine reviews collected from customers; emitting
// an invented one risks a manual action and the loss of rich results for the
// whole domain. Add it back only when real reviews exist to aggregate.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Dream Travels",
  url: siteUrl,
  description:
    "Dream Travels is a travel consultancy for India's mountains, forests, and hidden trails. Every itinerary is planned with a real consultant over WhatsApp.",
};

async function fetchFeaturedData() {
  const supabase = createPublicSupabaseClient();

  const [
    { data: destinations },
    { data: allDestinations },
    { data: packages },
    { data: topPickPackages },
    { data: reviewsData },
    { data: experiencesData },
    { data: budgetTiersData },
    { data: packagePrices },
    { data: reelsData },
    { data: mapDestinationsRaw },
  ] = await Promise.all([
    supabase
      .from("destinations")
      .select("id,slug,name,description,cover_image,image,price,rating,display_order,is_featured")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("destinations")
      .select("id,slug,name,description,cover_image,image,price,rating,display_order,is_featured")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("packages")
      .select(
        "id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id"
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("packages")
      .select(
        "id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id"
      )
      .eq("is_top_pick", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("reviews").select("id,name,avatar,rating,review,date").order("created_at", { ascending: false }),
    supabase.from("popular_experiences").select("id,title,image").order("created_at", { ascending: false }),
    supabase.from("budget_tiers").select("id,title,emoji,price_limit").order("price_limit", { ascending: true }),
    supabase.from("packages").select("price,destination_id").eq("status", "published"),
    supabase
      .from("reels")
      .select(
        "id,title,destination,description,video_url,thumbnail_url,instagram_url,category,is_active,display_order,package_id,packages(id,slug,title,price,original_price,image,duration)"
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("destinations")
      .select("id,slug,name,description,cover_image,image,region,state,lat,lng")
      .not("lat", "is", null)
      .not("lng", "is", null)
      .not("region", "is", null),
  ]);

  // Casts below needed: the Supabase client has no generated Database type,
  // so TypeScript infers query results as `never` instead of the real row
  // shape. See supabase_schema.md — generating types would remove this.
  type PackagePriceRow = { price: number | null; destination_id: string | null };
  type MapDestinationRow = {
    id: string;
    slug: string | null;
    name: string;
    description: string | null;
    cover_image: string | null;
    image: string | null;
    region: string | null;
    state: string | null;
    lat: number | null;
    lng: number | null;
  };
  const typedPackagePrices = packagePrices as PackagePriceRow[] | null;
  const typedMapDestinationsRaw = mapDestinationsRaw as MapDestinationRow[] | null;

  const mapPackage = (pkg: Record<string, unknown>): Package => ({
    id: pkg.id as string,
    slug: pkg.slug as string | undefined,
    title: pkg.title as string,
    location: pkg.location as string,
    image: pkg.image as string,
    category: pkg.category as string,
    duration: pkg.duration as string,
    pickup: pkg.pickup as string,
    dates: pkg.dates as string,
    rating: pkg.rating as number,
    reviews: pkg.reviews as number,
    price: pkg.price as number,
    originalPrice: (pkg.original_price ?? pkg.originalPrice) as number | undefined,
    destination_id: pkg.destination_id as string | undefined,
  });

  const featuredDestinations: Destination[] = (destinations?.length ? destinations : recommendedDestinations).map(
    (destination) => ({
      id: destination.id,
      slug: "slug" in destination ? destination.slug : undefined,
      name: destination.name,
      image: "cover_image" in destination ? destination.cover_image ?? destination.image : destination.image,
      price: destination.price,
      rating: destination.rating,
      description: "description" in destination ? destination.description ?? undefined : undefined,
    })
  );

  const interestingDestinations: MasonryDestination[] = (
    allDestinations?.length ? allDestinations : staticInterestingDestinations
  ).map((destination, i) => ({
    id: destination.id,
    name: destination.name,
    image: "cover_image" in destination ? destination.cover_image ?? destination.image : destination.image,
    price: destination.price,
    rating: destination.rating,
    span: i % 2 === 0 ? "tall" : "short",
  }));

  const featuredPackages: Package[] = (packages?.length ? packages : staticPackages).map(mapPackage);

  const topPicks: Package[] = (topPickPackages?.length ? topPickPackages : staticTopPicks).map(mapPackage);

  const reviews: Review[] = reviewsData?.length ? reviewsData : staticReviews;

  const experiences: PopularExperience[] = experiencesData?.length ? experiencesData : staticExperiences;

  const dbPrices = (typedPackagePrices ?? [])
    .map((row) => row.price)
    .filter((price): price is number => typeof price === "number");

  const staticAllPackages = [...staticPackages, ...staticTopPicks];
  const prices = dbPrices.length > 0
    ? dbPrices
    : (packages?.length ? packages : staticAllPackages).map((p) => p.price);

  const typedBudgetTiers = budgetTiersData as { id: string; title: string; emoji: string; price_limit: number }[] | null;

  const budgetTiers: BudgetTier[] = (
    typedBudgetTiers?.length
      ? typedBudgetTiers.map((tier) => ({
          id: tier.id,
          title: tier.title,
          emoji: tier.emoji,
          limit: String(tier.price_limit),
          count: prices.filter((price) => price <= Number(tier.price_limit)).length,
        }))
      : staticBudgetTiers.map((tier) => ({
          ...tier,
          count: prices.filter((price) => price <= Number(tier.limit)).length,
        }))
  );

  // Per-destination package stats for the map cards (min price + count),
  // computed from the same published-package rows used for budget tiers
  // above rather than a separate query.
  const packageStatsByDestination = new Map<string, { minPrice: number; count: number }>();
  for (const row of typedPackagePrices ?? []) {
    if (!row.destination_id || typeof row.price !== "number") continue;
    const existing = packageStatsByDestination.get(row.destination_id);
    if (existing) {
      existing.count += 1;
      existing.minPrice = Math.min(existing.minPrice, row.price);
    } else {
      packageStatsByDestination.set(row.destination_id, { minPrice: row.price, count: 1 });
    }
  }

  const dynamicMapDestinations: MapDestination[] = (typedMapDestinationsRaw ?? [])
    .filter((d): d is typeof d & { region: Region; lat: number; lng: number } =>
      MAP_REGIONS.has(d.region as Region)
    )
    .map((d) => {
      const stats = packageStatsByDestination.get(d.id);
      return {
        id: d.id,
        name: d.name,
        state: d.state ?? "",
        region: d.region,
        lat: d.lat,
        lng: d.lng,
        fromPrice: stats?.minPrice ?? 0,
        packageCount: stats?.count ?? 0,
        image: d.cover_image ?? d.image ?? "",
        blurb: d.description ?? "",
      };
    });

  const mapDestinations: MapDestination[] =
    dynamicMapDestinations.length > 0 ? dynamicMapDestinations : staticMapDestinations;

  const typedReels = reelsData as {
    id: string;
    title: string;
    destination: string | null;
    description: string | null;
    video_url: string;
    thumbnail_url: string;
    instagram_url: string | null;
    category: string | null;
    is_active: boolean;
    display_order: number;
    package_id: string | null;
    packages: {
      id: string;
      slug: string;
      title: string;
      price: number;
      original_price: number | null;
      image: string | null;
      duration: string | null;
    } | {
      id: string;
      slug: string;
      title: string;
      price: number;
      original_price: number | null;
      image: string | null;
      duration: string | null;
    }[] | null;
  }[] | null;

  const reels: Reel[] = (typedReels?.length ? typedReels : staticReels).map((reel) => {
    if (!("video_url" in reel)) return reel;

    const linkedPkg = Array.isArray(reel.packages) ? reel.packages[0] : reel.packages;

    return {
      id: reel.id,
      title: reel.title,
      destination: reel.destination,
      description: reel.description,
      videoUrl: reel.video_url,
      thumbnailUrl: reel.thumbnail_url,
      instagramUrl: reel.instagram_url,
      category: reel.category,
      packageId: reel.package_id,
      linkedPackage: linkedPkg
        ? {
            id: linkedPkg.id,
            slug: linkedPkg.slug,
            title: linkedPkg.title,
            price: linkedPkg.price,
            originalPrice: linkedPkg.original_price ?? undefined,
            image: linkedPkg.image ?? "",
            duration: linkedPkg.duration ?? "",
          }
        : null,
    };
  });

  return {
    featuredDestinations,
    interestingDestinations,
    featuredPackages,
    topPicks,
    reviews,
    experiences,
    budgetTiers,
    reels,
    mapDestinations,
  };
}

export default async function Home() {
  const {
    featuredDestinations,
    featuredPackages,
    reviews,
    experiences,
    budgetTiers,
    reels,
    mapDestinations,
  } = await fetchFeaturedData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1">
        <Hero />
        <CategorySlider />
        <PopularDestinationsGrid destinations={featuredDestinations} packages={featuredPackages} />
        <FeaturedPackagesGrid packages={featuredPackages} />
        <ReelsShowcase reels={reels} />
        <WhyChooseUs />
        <ReviewCarousel reviews={reviews} />
        <PromoBanner />
        <BudgetCards tiers={budgetTiers} />
        <Statistics />
        <ExploreByMap destinations={mapDestinations} />
        <PopularExperiences experiences={experiences} />
      </main>
    </>
  );
}

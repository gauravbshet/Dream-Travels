import { Hero } from "@/components/sections/Hero";
import { CategorySlider } from "@/components/sections/CategorySlider";
import { TrendingTrips } from "@/components/sections/TrendingTrips";
import { TrendingDestinations } from "@/components/sections/TrendingDestinations";
import { TopRatedPackages } from "@/components/sections/TopRatedPackages";
import { ExploreByMap } from "@/components/sections/ExploreByMap";
import { RecommendedDestinations } from "@/components/sections/RecommendedDestinations";
import { InterestingDestinations } from "@/components/sections/InterestingDestinations";
import { TopPicks } from "@/components/sections/TopPicks";
import { BudgetCards } from "@/components/sections/BudgetCards";
import { Statistics } from "@/components/sections/Statistics";
import { ReviewCarousel } from "@/components/sections/ReviewCarousel";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PopularExperiences } from "@/components/sections/PopularExperiences";
import { SeasonalCollections } from "@/components/sections/SeasonalCollections";
import { EventsSection } from "@/components/sections/EventsSection";
import { heroBadge } from "@/data/site";
import { createServerSupabaseClient } from "@/lib/supabase.server";
import { Destination, MasonryDestination, BudgetTier } from "@/data/destinations";
import { Package } from "@/data/packages";
import {
  recommendedDestinations,
  interestingDestinations as staticInterestingDestinations,
  budgetTiers as staticBudgetTiers,
  popularExperiences as staticExperiences,
  seasonalCollections as staticCollections,
} from "@/data/destinations";
import { packages as staticPackages, topPicks as staticTopPicks } from "@/data/packages";
import { reviews as staticReviews, type Review } from "@/data/reviews";
import { events as staticEvents, type TravelEvent } from "@/data/events";
import type { PopularExperience, SeasonalCollection } from "@/data/destinations";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamtravels.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Dream Travels",
  url: siteUrl,
  description:
    "Dream Travels is a premium travel booking platform for curated trips, dream destinations, and unforgettable experiences across the globe.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: heroBadge.rating,
    reviewCount: heroBadge.reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
};

async function fetchFeaturedData() {
  const supabase = createServerSupabaseClient();

  const [
    { data: destinations },
    { data: allDestinations },
    { data: packages },
    { data: topPickPackages },
    { data: reviewsData },
    { data: eventsData },
    { data: experiencesData },
    { data: collectionsData },
    { data: budgetTiersData },
    { data: destinationPrices },
  ] = await Promise.all([
    supabase
      .from("destinations")
      .select("id,slug,name,description,cover_image,image,price,rating")
      .eq("is_featured", true)
      .order("updated_at", { ascending: false }),
    supabase
      .from("destinations")
      .select("id,slug,name,description,cover_image,image,price,rating")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("packages")
      .select(
        "id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id"
      )
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("packages")
      .select(
        "id,slug,title,location,image,category,duration,pickup,dates,rating,reviews,price,original_price,destination_id"
      )
      .eq("is_top_pick", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("reviews").select("id,name,avatar,rating,review,date").order("created_at", { ascending: false }),
    supabase.from("events").select("id,title,image,date,location").order("created_at", { ascending: false }),
    supabase.from("popular_experiences").select("id,title,image").order("created_at", { ascending: false }),
    supabase.from("seasonal_collections").select("id,title,image").order("created_at", { ascending: false }),
    supabase.from("budget_tiers").select("id,title,emoji,price_limit").order("price_limit", { ascending: true }),
    supabase.from("destinations").select("price"),
  ]);

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

  const events: TravelEvent[] = eventsData?.length ? eventsData : staticEvents;

  const experiences: PopularExperience[] = experiencesData?.length ? experiencesData : staticExperiences;

  const collections: SeasonalCollection[] = collectionsData?.length ? collectionsData : staticCollections;

  const prices = (destinationPrices ?? [])
    .map((row) => row.price)
    .filter((price): price is number => typeof price === "number");

  const budgetTiers: BudgetTier[] = budgetTiersData?.length
    ? budgetTiersData.map((tier) => ({
        id: tier.id,
        title: tier.title,
        emoji: tier.emoji,
        limit: String(tier.price_limit),
        count: prices.filter((price) => price <= tier.price_limit).length,
      }))
    : staticBudgetTiers;

  return {
    featuredDestinations,
    interestingDestinations,
    featuredPackages,
    topPicks,
    reviews,
    events,
    experiences,
    collections,
    budgetTiers,
  };
}

export default async function Home() {
  const {
    featuredDestinations,
    interestingDestinations,
    featuredPackages,
    topPicks,
    reviews,
    events,
    experiences,
    collections,
    budgetTiers,
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
        <TrendingTrips packages={featuredPackages} />
        <TrendingDestinations />
        <RecommendedDestinations destinations={featuredDestinations} />
        <InterestingDestinations destinations={interestingDestinations} />
        <TopRatedPackages packages={featuredPackages} />
        <TopPicks packages={topPicks} />
        <BudgetCards tiers={budgetTiers} />
        <Statistics />
        <ExploreByMap />
        <ReviewCarousel reviews={reviews} />
        <WhyChooseUs />
        <PopularExperiences experiences={experiences} />
        <SeasonalCollections collections={collections} />
        <EventsSection events={events} />
      </main>
    </>
  );
}

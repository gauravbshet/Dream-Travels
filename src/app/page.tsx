import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { CategorySlider } from "@/components/sections/CategorySlider";
import { TrendingTrips } from "@/components/sections/TrendingTrips";
import { RecommendedDestinations } from "@/components/sections/RecommendedDestinations";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { InterestingDestinations } from "@/components/sections/InterestingDestinations";
import { TopPicks } from "@/components/sections/TopPicks";
import { BudgetCards } from "@/components/sections/BudgetCards";
import { Statistics } from "@/components/sections/Statistics";
import { ReviewCarousel } from "@/components/sections/ReviewCarousel";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PopularExperiences } from "@/components/sections/PopularExperiences";
import { SeasonalCollections } from "@/components/sections/SeasonalCollections";
import { BlogSection } from "@/components/sections/BlogSection";
import { EventsSection } from "@/components/sections/EventsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CategorySlider />
        <TrendingTrips />
        <RecommendedDestinations />
        <PromoBanner />
        <InterestingDestinations />
        <TopPicks />
        <BudgetCards />
        <Statistics />
        <ReviewCarousel />
        <WhyChooseUs />
        <PopularExperiences />
        <SeasonalCollections />
        <BlogSection />
        <EventsSection />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}

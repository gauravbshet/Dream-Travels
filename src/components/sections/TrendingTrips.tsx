import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { Section } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { packages } from "@/data/packages";
import type { Package } from "@/data/packages";

export function TrendingTrips({
  packages: featuredPackages = packages,
}: {
  packages?: Package[];
}) {
  return (
    <Section tone="light" id="community">
      <Container>
        <div className="flex flex-col gap-4 mb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-canopy/10 px-3 py-1 text-[11px] font-semibold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-canopy/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-canopy" />
              </span>
              Live right now
            </span>
          </div>

          <Link
            href="#packages"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-500 hover:underline"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-0.5" />
          </Link>
        </div>

        <SectionHeading
          title="Trending Community Trips"
          description="Real trips booked and loved by fellow travellers right now."
        />
      </Container>
      <Container>
        <Carousel label="Trending community trips">
          {featuredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              variant="compact"
              className="snap-start"
            />
          ))}
        </Carousel>
      </Container>
    </Section>
  );
}

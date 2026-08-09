"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { PackageCard } from "@/components/cards/PackageCard";
import { packages as staticPackages, type Package } from "@/data/packages";

/**
 * Featured Packages section on the homepage: renders curated package cards
 * matching the card size, layout, and styling from category package pages.
 */
export function FeaturedPackagesGrid({
  packages = staticPackages,
}: {
  packages?: Package[];
}) {
  const featured = packages.slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <Section tone="sage" id="featured-packages" className="pt-2.5 sm:pt-4 lg:pt-6">
      <Container>
        <SectionHeading
          title="Featured Packages"
          description="Complete, ready-to-book trips — flights, stays, and experiences bundled in."
        />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 lg:gap-6">
          {featured.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              className="w-[200px] sm:w-[225px] lg:w-full snap-start"
            />
          ))}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}



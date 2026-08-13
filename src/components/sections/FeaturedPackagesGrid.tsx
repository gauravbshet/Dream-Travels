"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <Section tone="sage" id="featured-packages" className="pt-1 sm:pt-2 lg:pt-3">
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
        <div className="mt-5 flex justify-center sm:mt-6">
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-canopy/30 hover:text-canopy"
          >
            View More Packages
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}



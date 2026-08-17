"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { PackageCard } from "@/components/cards/PackageCard";
import type { Package } from "@/data/packages";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Featured Packages section on the homepage: renders curated package cards
 * matching the card size, layout, and styling from category package pages.
 */
export function FeaturedPackagesGrid({
  packages = [],
}: {
  packages?: Package[];
}) {
  const featured = packages.slice(0, 8);

  return (
    <Section tone="sage" id="featured-packages" className="pt-1 sm:pt-2 lg:pt-3">
      <Container>
        <SectionHeading
          title="Featured Packages"
          description="Complete, ready-to-book trips — flights, stays, and experiences bundled in."
        />
        {featured.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-border bg-surface p-8 sm:p-10 text-center shadow-2xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-canopy/10 px-3.5 py-1 text-xs font-bold text-canopy border border-canopy/20">
              <Sparkles className="h-3.5 w-3.5" /> Coming Soon
            </span>
            <h3 className="mt-4 text-xl font-bold text-ink">New Packages Launching Soon!</h3>
            <p className="mt-2 text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
              Our travel team is finalizing new custom itineraries and holiday escapes. Contact us on WhatsApp for custom trip requests!
            </p>
            <a
              href={buildWhatsAppLink("Hello Dream Travels! I would like to inquire about upcoming trip packages.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-canopy hover:bg-canopy-hover px-5 py-2.5 text-xs font-bold text-white transition-all shadow-xs"
            >
              <MessageSquare className="h-4 w-4" /> Request Custom Trip
            </a>
          </div>
        ) : (
          <>
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
          </>
        )}
      </Container>
    </Section>
  );
}



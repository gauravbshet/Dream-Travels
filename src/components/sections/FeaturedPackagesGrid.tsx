"use client";

import Image from "next/image";
import { MapPin, Star, CalendarRange } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { formatPrice } from "@/lib/utils";
import { packages as staticPackages, type Package } from "@/data/packages";

/**
 * The homepage's centerpiece: full package cards with an offer badge,
 * wishlist toggle, price (with strike-through original), rating, and both
 * a "Book Now" and "View Details" action. Swipeable on mobile/tablet,
 * 4-up grid on desktop.
 */
export function FeaturedPackagesGrid({
  packages = staticPackages,
}: {
  packages?: Package[];
}) {
  const featured = packages.slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <Section tone="sage">
      <Container>
        <SectionHeading
          title="Featured Packages"
          description="Complete, ready-to-book trips — flights, stays, and experiences bundled in."
        />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 lg:gap-6">
          {featured.map((pkg) => {
            const badge = getBadge(pkg);

            return (
              <article
                key={pkg.id}
                className="group flex h-full w-[47%] shrink-0 flex-col justify-between snap-start overflow-hidden rounded-[20px] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[44%] lg:w-full"
              >
                <div className="relative aspect-[5/4] w-full overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 1024px) 60vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  {badge && (
                    <span className={`absolute left-2 top-2 rounded-full border border-white/20 bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm`}>
                      {badge.label}
                    </span>
                  )}

                  <WishlistButton className="absolute right-2 top-2 h-8 w-8 rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm" />

                  <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                    {pkg.duration}
                  </span>
                </div>

                <div className="flex h-full flex-col gap-1.5 p-2.5 sm:p-3">
                  <h3 className="h-[2.6rem] line-clamp-2 text-[13px] font-bold leading-snug text-ink">{pkg.title}</h3>

                  <p className="flex items-center gap-1 text-[11px] text-ink-muted">
                    <MapPin className="h-3 w-3 shrink-0 text-canopy" />
                    <span className="truncate">{pkg.location}</span>
                  </p>

                  <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap rounded-full bg-sage-100/80 px-2 py-1 text-[10px] font-medium text-ink">
                    <CalendarRange className="h-3 w-3 shrink-0 text-canopy" />
                    <span className="truncate">{pkg.dates}</span>
                    <span className="ml-1 shrink-0 font-semibold text-orange-500">+4 Batches</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <span className="text-[13px] font-extrabold text-ink">
                      {formatPrice(pkg.price)} <span className="text-[10px] font-medium text-ink-muted">/person</span>
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-ink">
                      <Star className="h-3 w-3 shrink-0 fill-black text-black" /> {pkg.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}

function getBadge(pkg: Package): { label: string; className: string } | null {
  if (pkg.rating >= 4.8) {
    return { label: "Popular", className: "bg-amber" };
  }
  if (pkg.rating >= 4.5) {
    return { label: "Trending", className: "bg-canopy" };
  }
  return null;
}

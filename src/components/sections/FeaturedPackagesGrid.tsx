"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, CalendarRange, Compass } from "lucide-react";
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
            const original = pkg.originalPrice ?? pkg.original_price;
            const badge = getBadge(pkg);

            return (
              <article
                key={pkg.id}
                className="group w-[47%] shrink-0 snap-start overflow-hidden rounded-[20px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[44%] lg:w-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 1024px) 60vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  {badge && (
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${badge.className}`}>
                      {badge.label}
                    </span>
                  )}

                  <WishlistButton className="absolute right-2.5 top-2.5 h-8 w-8" />

                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                    {pkg.duration}
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-ink shadow-sm">
                    {pkg.pickup}
                  </span>
                </div>

                <div className="flex h-full flex-col p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-ink sm:text-sm">{pkg.title}</h3>
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-muted sm:text-xs">
                        <MapPin className="h-3 w-3 shrink-0 text-canopy" />
                        <span className="truncate">{pkg.location}</span>
                      </p>
                    </div>
                    <span className="flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-ink sm:text-xs">
                      <Star className="h-3 w-3 shrink-0 fill-amber text-amber" /> {pkg.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 rounded-full bg-sage-100/70 px-2.5 py-1 text-[10px] font-medium text-ink sm:text-xs">
                    <CalendarRange className="h-3 w-3 shrink-0 text-canopy" />
                    <span className="truncate">{pkg.dates}</span>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                      {original && original > pkg.price && (
                        <span className="text-[11px] text-ink-muted line-through">{formatPrice(original)}</span>
                      )}
                      <span className="text-base font-extrabold text-ink">{formatPrice(pkg.price)}</span>
                    </div>
                    <span className="rounded-full bg-canopy/10 px-2 py-1 text-[10px] font-semibold text-canopy">
                      {pkg.category}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href={`/packages/${pkg.slug ?? pkg.id}`}
                      className="flex items-center justify-center rounded-[12px] border border-border py-2 text-[11px] font-bold text-ink transition-colors hover:bg-surface-sage sm:py-2.5 sm:text-xs"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/booking?package=${encodeURIComponent(pkg.slug ?? pkg.id)}`}
                      className="flex items-center justify-center rounded-[12px] bg-canopy py-2 text-[11px] font-bold text-white transition-colors hover:bg-canopy-hover sm:py-2.5 sm:text-xs"
                    >
                      Book Now
                    </Link>
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
  const original = pkg.originalPrice ?? pkg.original_price;
  if (original && original > pkg.price) {
    return { label: "Limited Offer", className: "bg-rose-500" };
  }
  if (pkg.rating >= 4.8) {
    return { label: "Best Seller", className: "bg-amber" };
  }
  if (pkg.rating >= 4.5) {
    return { label: "Trending", className: "bg-canopy" };
  }
  return null;
}

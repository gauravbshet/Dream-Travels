"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
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
                className="group w-[78%] shrink-0 snap-start overflow-hidden rounded-[20px] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl xs:w-[64%] sm:w-[44%] lg:w-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 1024px) 60vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  {badge && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  )}
                  <WishlistButton className="absolute right-3 top-3 h-9 w-9" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {pkg.duration}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1 text-xs text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 text-canopy" /> {pkg.location}
                    </p>
                    <span className="flex items-center gap-1 text-xs font-bold text-ink">
                      <Star className="h-3.5 w-3.5 fill-amber text-amber" /> {pkg.rating.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-ink">{pkg.title}</h3>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    {original && original > pkg.price && (
                      <span className="text-xs text-ink-muted line-through">{formatPrice(original)}</span>
                    )}
                    <span className="text-lg font-extrabold text-ink">{formatPrice(pkg.price)}</span>
                    <span className="text-xs text-ink-muted">/person</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/packages/${pkg.slug ?? pkg.id}`}
                      className="flex items-center justify-center rounded-[12px] border border-border py-2.5 text-xs font-bold text-ink transition-colors hover:bg-surface-sage"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/booking?package=${encodeURIComponent(pkg.slug ?? pkg.id)}`}
                      className="flex items-center justify-center rounded-[12px] bg-canopy py-2.5 text-xs font-bold text-white transition-colors hover:bg-canopy-hover"
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Star, CalendarRange, Clock3, Crown, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { formatPrice } from "@/lib/utils";
import { packages as staticPackages, type Package } from "@/data/packages";

/**
 * The homepage's centerpiece: full package cards with an offer badge,
 * wishlist toggle, price (with strike-through original), rating, and direct
 * booking action matching the site's brand theme.
 */
export function FeaturedPackagesGrid({
  packages = staticPackages,
}: {
  packages?: Package[];
}) {
  const featured = packages.slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <Section tone="sage" id="featured-packages">
      <Container>
        <SectionHeading
          title="Featured Packages"
          description="Complete, ready-to-book trips — flights, stays, and experiences bundled in."
        />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 lg:gap-6">
          {featured.map((pkg) => (
            <FeaturedPackageCard key={pkg.id} pkg={pkg} />
          ))}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}

function FeaturedPackageCard({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const original = pkg.originalPrice ?? pkg.original_price;
  const badge = getBadge(pkg);
  const href = `/packages/${pkg.slug ?? pkg.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col h-full shrink-0 w-[260px] sm:w-[280px] lg:w-full snap-start"
    >
      <article className="flex flex-col h-full flex-1">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-1 flex-col overflow-hidden rounded-[20px] border border-border/80 bg-surface shadow-2xs transition-all duration-300 hover:shadow-lg hover:border-canopy/40 hover:-translate-y-1"
        >
          {/* Image & Overlay Header */}
          <div
            data-tone="dark"
            className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[20px] shrink-0"
          >
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/20" />

            {/* Top Left: Category / Status Badge */}
            {badge && (
              <span className="absolute left-3 top-3 z-[3] inline-flex items-center gap-1 rounded-full bg-canopy px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xs">
                <Sparkles className="h-3 w-3" />
                {badge.label}
              </span>
            )}

            {/* Top Right: Wishlist Toggle */}
            <WishlistButton className="absolute right-3 top-3 z-[3] flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60" />

            {/* Bottom Overlay Badges */}
            <div className="absolute inset-x-0 bottom-0 z-[3] flex items-center justify-between p-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                <Clock3 className="h-3 w-3 text-canopy" />
                {pkg.duration}
              </span>
              {pkg.pickup && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                  <Crown className="h-3 w-3 text-amber-400" />
                  {pkg.pickup}
                </span>
              )}
            </div>
          </div>

          {/* Card Body Content */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-4 gap-3.5">
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-[15px] sm:text-[16px] font-bold leading-snug text-ink transition-colors group-hover:text-canopy line-clamp-2">
                {pkg.title}
              </h3>

              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-canopy" />
                  <span className="truncate">{pkg.location}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-canopy/10 border border-canopy/15 px-2 py-0.5 text-[11px] font-extrabold text-ink">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{pkg.rating.toFixed(1)}</span>
                </div>
              </div>

              {pkg.dates && (
                <div className="flex items-center justify-between gap-1 overflow-hidden whitespace-nowrap rounded-full bg-sage-100/80 px-2.5 py-1 text-[10.5px] font-medium text-ink border border-border/40">
                  <div className="flex items-center gap-1 truncate">
                    <CalendarRange className="h-3 w-3 shrink-0 text-canopy" />
                    <span className="truncate">{pkg.dates}</span>
                  </div>
                  <span className="shrink-0 font-bold text-canopy">+4 Batches</span>
                </div>
              )}
            </div>

            {/* Footer: Price & Theme-Matched Booking Action */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  {original && original > pkg.price && (
                    <span className="text-[11px] font-medium text-gray-400 line-through">
                      {formatPrice(original)}
                    </span>
                  )}
                  <span className="text-[16px] sm:text-[17px] font-extrabold leading-none text-ink">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
                <span className="mt-1 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  per person onwards
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/booking?package=${encodeURIComponent(pkg.slug ?? pkg.id)}`);
                }}
                className="inline-flex items-center justify-center rounded-full bg-canopy hover:bg-canopy-hover active:scale-95 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-xs transition-all duration-200 hover:shadow-md"
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
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


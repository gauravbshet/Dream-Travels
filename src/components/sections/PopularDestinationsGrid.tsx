"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { formatPrice } from "@/lib/utils";
import { recommendedDestinations as staticDestinations, type Destination } from "@/data/destinations";
import { packages as staticPackages, type Package } from "@/data/packages";

/**
 * Premium destination showcase: image, name, rating, location, starting price,
 * and a live package count. Horizontal swipe with 3 cards per slide on mobile,
 * 4-up grid on desktop (via ResponsiveScroller).
 */
export function PopularDestinationsGrid({
  destinations = staticDestinations,
  packages = staticPackages,
}: {
  destinations?: Destination[];
  packages?: Package[];
}) {
  if (destinations.length === 0) return null;

  return (
    <Section tone="light" className="pb-2 sm:pb-4 lg:pb-6">
      <Container>
        <SectionHeading
          title="Popular Destinations"
          description="Handpicked places our travellers keep coming back to."
        />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 lg:gap-6">
          {destinations.slice(0, 8).map((destination) => {
            const matchingPackages = packages.filter(
              (pkg) =>
                pkg.destination_id === destination.id ||
                (pkg.location && pkg.location.toLowerCase().includes(destination.name.toLowerCase()))
            );
            const packageCount = matchingPackages.length;
            const minPackagePrice =
              matchingPackages.length > 0
                ? Math.min(...matchingPackages.map((p) => p.price))
                : null;
            const startingPrice = minPackagePrice ?? destination.price;

            return (
              <Link
                key={destination.id}
                href={`/destinations/${destination.slug ?? destination.id}`}
                className="group w-[38%] sm:w-[36%] lg:w-full shrink-0 snap-start overflow-hidden rounded-[16px] sm:rounded-[18px] lg:rounded-[20px] border border-border bg-surface transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 35vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {packageCount > 0 && (
                    <span className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[9.5px] sm:text-[10px] lg:text-[11px] font-bold text-ink shadow-2xs sm:shadow-sm">
                      {packageCount} {packageCount === 1 ? "pkg" : "pkgs"}
                    </span>
                  )}
                  <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-2.5 flex items-center justify-between text-white text-[10px] sm:text-xs">
                    <span className="flex items-center gap-1 font-medium truncate">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      <span className="truncate">{destination.name}</span>
                    </span>
                    {destination.rating != null && (
                      <span className="flex items-center gap-0.5 font-bold shrink-0">
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber text-amber" />
                        <span>{destination.rating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 lg:p-4">
                  <h3 className="font-bold text-xs sm:text-sm lg:text-base text-ink truncate">
                    {destination.name}
                  </h3>
                  {startingPrice != null && (
                    <p className="mt-0.5 text-[11px] sm:text-xs text-ink-muted truncate">
                      Starting from <span className="font-bold text-canopy">{formatPrice(startingPrice)}</span>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}

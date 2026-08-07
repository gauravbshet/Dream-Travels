"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { recommendedDestinations as staticDestinations, type Destination } from "@/data/destinations";
import { packages as staticPackages, type Package } from "@/data/packages";

/**
 * Premium destination showcase: image, name, rating, location, and a live
 * package count derived from the packages list. Horizontal swipe on mobile
 * and tablet, 4-up grid on desktop (via ResponsiveScroller).
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
    <Section tone="light">
      <Container>
        <SectionHeading
          title="Popular Destinations"
          description="Handpicked places our travellers keep coming back to."
        />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 lg:gap-6">
          {destinations.slice(0, 8).map((destination) => {
            const packageCount = packages.filter(
              (pkg) => pkg.destination_id === destination.id
            ).length;

            return (
              <Link
                key={destination.id}
                href={`/destinations/${destination.slug ?? destination.id}`}
                className="group w-[72%] shrink-0 snap-start overflow-hidden rounded-[20px] border border-border bg-surface transition-shadow duration-300 hover:shadow-xl xs:w-[62%] sm:w-[42%] lg:w-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 1024px) 60vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {packageCount > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm">
                      {packageCount} {packageCount === 1 ? "package" : "packages"}
                    </span>
                  )}
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-white">
                    <span className="flex items-center gap-1 text-xs font-medium">
                      <MapPin className="h-3.5 w-3.5" /> {destination.name}
                    </span>
                    {destination.rating != null && (
                      <span className="flex items-center gap-1 text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber text-amber" /> {destination.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-ink">{destination.name}</h3>
                  {destination.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{destination.description}</p>
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

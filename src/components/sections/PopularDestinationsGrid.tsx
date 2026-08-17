import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { formatPrice } from "@/lib/utils";
import { recommendedDestinations as staticDestinations, type Destination } from "@/data/destinations";
import type { Package } from "@/data/packages";
import { cldUrl } from "@/lib/cloudinary";

/**
 * Popular destination showcase: 2-column grid (no scroll), 2 cards only,
 * styled like the All Destinations page — image, name, rating, description.
 */
export function PopularDestinationsGrid({
  destinations = staticDestinations,
  packages = [],
}: {
  destinations?: Destination[];
  packages?: Package[];
}) {
  if (destinations.length === 0) return null;

  const featured = destinations.slice(0, 8);

  return (
    <Section tone="light" className="pb-1 sm:pb-2 lg:pb-3">
      <Container>
        <SectionHeading
          title="Popular Destinations"
          description="Handpicked places our travellers keep coming back to."
        />
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((destination) => {
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
                className="group overflow-hidden rounded-[16px] border border-border bg-surface transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {destination.image && destination.image.trim() !== "" ? (
                    <Image
                      src={cldUrl(destination.image, 500)}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-200 transition-transform duration-500 ease-out group-hover:scale-110" />
                  )}
                  {packageCount > 0 && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9.5px] font-bold text-ink shadow-sm">
                      {packageCount} {packageCount === 1 ? "pkg" : "pkgs"}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="flex items-center gap-1 font-semibold text-sm text-ink truncate">
                      <MapPin className="h-3.5 w-3.5 text-canopy shrink-0" />
                      <span className="truncate">{destination.name}</span>
                    </h3>
                    {destination.rating != null && (
                      <span className="flex items-center gap-0.5 text-xs font-bold text-ink shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                        {destination.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {startingPrice != null && (
                    <p className="mt-1 text-[11px] text-ink-muted truncate">
                      From <span className="font-bold text-canopy">{formatPrice(startingPrice)}</span>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center sm:mt-8">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-all duration-300 hover:border-canopy/40 hover:text-canopy"
          >
            View All Destinations
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

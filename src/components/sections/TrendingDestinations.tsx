"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame, MapPin, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { mapDestinations, type MapDestination } from "@/data/map";
import { formatPrice } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary";

export function TrendingDestinations({
  destinations = mapDestinations,
}: {
  destinations?: MapDestination[];
}) {
  // Busiest first — "trending" should reflect something real.
  const trending = [...destinations]
    .sort((a, b) => b.packageCount - a.packageCount)
    .slice(0, 10);

  return (
    <Section tone="image" id="trending">
      <Container>
        <Reveal>
          <div className="mb-4 sm:mb-5 lg:mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display-section text-ink">Trending destinations</h2>
              <p className="prose-measure mt-3 text-base text-ink-muted lg:text-lg">
                Where our travellers are heading most this season.
              </p>
            </div>
            <Link
              href="#map"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy transition-colors hover:text-ink"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Carousel label="Trending destinations">
          {trending.map((destination) => (
            <TrendingTile key={destination.id} destination={destination} />
          ))}
        </Carousel>
      </Container>
    </Section>
  );
}

function TrendingTile({ destination }: { destination: MapDestination }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group flex flex-col h-full shrink-0 w-[200px] sm:w-[225px] snap-start"
    >
      <article className="flex flex-col h-full flex-1">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-1 flex-col overflow-hidden rounded-[16px] border border-border/70 bg-surface shadow-2xs transition-all duration-300 hover:shadow-md hover:border-canopy/30"
        >
          {/* Image & Overlay Badges Header */}
          <div data-tone="dark" className="relative h-[135px] w-full overflow-hidden rounded-t-[16px] shrink-0 sm:h-[150px]">
            <Image
              src={cldUrl(destination.image, 500)}
              alt={`${destination.name}, ${destination.state}`}
              fill
              sizes="(max-width: 640px) 200px, 250px"
              className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

            {/* Top Left: Category Badge */}
            <span className="absolute left-2.5 top-2.5 z-[3] rounded-md bg-canopy px-2 py-0.5 text-[9.5px] sm:text-[10px] font-semibold text-white shadow-2xs">
              Trending
            </span>

            {/* Top Right: Wishlist Heart */}
            <WishlistButton className="absolute right-2.5 top-2.5 z-[3] rounded-full bg-black/30 p-1 sm:p-1.5 text-white backdrop-blur-md hover:bg-black/50" />

            {/* Bottom Left: Duration/Trip Count Badge */}
            <span className="absolute bottom-2.5 left-2.5 z-[3] flex items-center gap-1 rounded-full bg-canopy px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-white shadow-xs">
              <Flame className="h-3 w-3 fill-white text-white" />
              {destination.packageCount} Trips
            </span>
          </div>

          {/* Card Body Details */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-3 sm:p-3.5">
            <div className="flex flex-col justify-start">
              <h3 className="font-sans text-[14px] sm:text-[15px] font-bold tracking-tight text-ink truncate transition-colors group-hover:text-canopy">
                {destination.name}
              </h3>

              <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-[11.5px] font-medium text-ink-muted">
                <MapPin className="h-3 w-3 shrink-0 text-canopy" />
                <span className="truncate">{destination.state}, India</span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
              <div className="flex min-w-0 items-baseline gap-1 overflow-hidden whitespace-nowrap">
                <span className="shrink-0 text-[15px] sm:text-[16px] font-extrabold leading-none text-ink">
                  {formatPrice(destination.fromPrice)}
                </span>
                <span className="shrink-0 text-[10px] font-medium leading-none text-gray-400">
                  /person
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-ink">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

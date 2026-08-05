"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { mapDestinations, type MapDestination } from "@/data/map";
import { formatPrice } from "@/lib/utils";

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
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-12">
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
      className="group block w-[240px] shrink-0 snap-start sm:w-[268px] lg:w-[288px]"
    >
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className="spotlight lit-edge relative aspect-[3/4] overflow-hidden rounded-[14px] border border-border"
      >
        <Image
          src={destination.image}
          alt={`${destination.name}, ${destination.state}`}
          fill
          sizes="(max-width: 640px) 70vw, 290px"
          className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.018_158/0.5)] via-[oklch(0.14_0.02_158/0.15)] to-transparent" />

        <WishlistButton className="absolute right-3 top-3 z-[3]" />

        <div className="absolute inset-x-0 bottom-0 z-[3] p-4">
          <span className="text-[11px] font-medium tracking-[0.08em] text-canopy">
            EXPLORE
          </span>
          <h3 className="font-display mt-1 text-[26px] leading-none text-ink">
            {destination.name}
          </h3>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="text-[13px] text-ink-2">
              From {formatPrice(destination.fromPrice)}
            </span>
            <span className="text-[12px] text-ink-muted">
              {destination.packageCount} trips
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

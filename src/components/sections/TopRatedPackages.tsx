"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star, Calendar, MapPin, Flame } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal } from "@/components/ui/Reveal";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { formatPrice } from "@/lib/utils";
import { packages as staticPackages, type Package } from "@/data/packages";

export function TopRatedPackages({
  packages = staticPackages,
}: {
  packages?: Package[];
}) {
  const topRated = [...packages]
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 10);

  return (
    <Section tone="light" id="top-rated">
      <Container>
        <Reveal>
          <div className="mb-4 sm:mb-5 lg:mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display-section text-ink">Top rated packages</h2>
              <p className="prose-measure mt-3 text-base text-ink-muted lg:text-lg">
                Ranked by what travellers scored after they got back.
              </p>
            </div>
            <Link
              href="#packages"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy transition-colors hover:text-ink"
            >
              View all
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <Carousel label="Top rated packages">
          {topRated.map((pkg, i) => (
            <RatedPackageCard key={pkg.id} pkg={pkg} rank={i + 1} />
          ))}
        </Carousel>
      </Container>
    </Section>
  );
}

function RatedPackageCard({ pkg, rank }: { pkg: Package; rank: number }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const original = pkg.originalPrice ?? pkg.original_price;

  return (
    <Link
      href={`/packages/${pkg.slug ?? pkg.id}`}
      className="group block w-[160px] xs:w-[175px] sm:w-[220px] lg:w-[245px] shrink-0 snap-start"
    >
      <article className="h-full">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-col overflow-hidden rounded-[16px] border border-border/80 bg-surface shadow-xs transition-shadow duration-300 hover:shadow-md"
        >
          {/* Image & Overlay Badges Header */}
          <div data-tone="dark" className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 640px) 80vw, 310px"
              className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Rank badge top left */}
            <span className="absolute left-2.5 top-2.5 z-[3] flex h-6 min-w-6 items-center justify-center rounded-md bg-canopy/90 px-1.5 text-[10px] font-extrabold text-white backdrop-blur-md shadow-2xs">
              #{rank}
            </span>

            {/* Category tag right next to rank */}
            <span className="absolute left-10 top-2.5 z-[3] rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
              {pkg.category}
            </span>

            {/* Wishlist Heart */}
            <WishlistButton className="absolute right-2.5 top-2.5 z-[3] rounded-full bg-black/30 p-1.5 text-white backdrop-blur-md hover:bg-black/50" />

            {/* Bottom Left: Duration Pill */}
            <span className="absolute bottom-2.5 left-2.5 z-[3] rounded-xs bg-black/75 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-md">
              {pkg.duration}
            </span>
          </div>

          {/* Brand Emblem Icon */}
          <div className="relative -mt-3 ml-3 z-[4] flex h-6 w-6 items-center justify-center rounded-full bg-canopy text-white shadow-sm ring-2 ring-surface">
            <Flame className="h-3.5 w-3.5 fill-white text-white" />
          </div>

          {/* Card Body Details */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-3 pt-1">
            <div>
              <h3 className="font-sans text-[13.5px] sm:text-[14px] font-bold leading-snug tracking-tight text-ink line-clamp-2 group-hover:text-canopy transition-colors">
                {pkg.title}
              </h3>

              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-ink-muted">
                <MapPin className="h-3 w-3 text-canopy shrink-0" />
                <span className="truncate">{pkg.location}</span>
              </div>

              <div className="mt-1 flex items-center justify-between gap-1 text-[11px] font-medium text-ink-muted">
                <div className="flex items-center gap-1 truncate">
                  <Calendar className="h-3 w-3 text-amber-500 shrink-0" />
                  <span className="truncate">{pkg.dates}</span>
                </div>
                <span className="shrink-0 rounded bg-amber-500/10 px-1 py-0.5 text-[9.5px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  +4 Batches
                </span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
              <div className="flex items-baseline gap-0.5">
                {original && original > pkg.price && (
                  <span className="text-[11px] text-ink-muted line-through mr-0.5">
                    {formatPrice(original)}
                  </span>
                )}
                <span className="text-[15px] font-extrabold text-ink">
                  {formatPrice(pkg.price)}
                </span>
                <span className="text-[10px] font-normal text-ink-muted">
                  /person
                </span>
              </div>

              <div className="flex items-center gap-0.5 text-[11px] font-bold text-ink">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{pkg.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

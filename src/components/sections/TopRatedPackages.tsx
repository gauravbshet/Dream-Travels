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
      className="group flex flex-col h-full shrink-0 w-[190px] sm:w-[210px] snap-start"
    >
      <article className="flex flex-col h-full flex-1">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-1 flex-col overflow-hidden rounded-[14px] border border-border/70 bg-surface shadow-2xs transition-all duration-300 hover:shadow-md hover:border-canopy/30"
        >
          {/* Image & Overlay Badges Header */}
          <div data-tone="dark" className="relative h-[126px] w-full overflow-hidden rounded-t-[14px] shrink-0 sm:h-[142px]">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 640px) 190px, 240px"
              className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

            {/* Rank badge + category top left */}
            <div className="absolute left-2 top-2 z-[3] flex items-center gap-1">
              <span className="flex h-5 items-center justify-center rounded-md bg-canopy px-1.5 text-[9px] sm:text-[10px] font-extrabold text-white shadow-2xs">
                #{rank}
              </span>
              <span className="rounded-md bg-black/50 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white backdrop-blur-md">
                {pkg.category}
              </span>
            </div>

            {/* Wishlist Heart */}
            <WishlistButton className="absolute right-2 top-2 z-[3] rounded-full bg-black/30 p-1 sm:p-1.5 text-white backdrop-blur-md hover:bg-black/50" />

            {/* Bottom Left: Duration Badge Overlay */}
            <span className="absolute bottom-2 left-2 z-[3] flex items-center gap-1 rounded-full bg-canopy px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-bold tracking-wide text-white shadow-xs">
              <Flame className="h-3 w-3 fill-white text-white" />
              {pkg.duration}
            </span>
          </div>

          {/* Card Body Details */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-3 sm:p-3.5">
            <div className="flex flex-col justify-start">
              <h3 className="font-sans text-[13px] sm:text-[14px] font-semibold leading-[1.25] tracking-tight text-ink line-clamp-2 min-h-[34px] sm:min-h-[38px] flex items-center transition-colors group-hover:text-canopy">
                {pkg.title}
              </h3>

              <div className="mt-1 flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium text-ink-muted">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-canopy" />
                <span className="truncate">{pkg.location}</span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
              <div className="flex min-w-0 items-baseline gap-1 overflow-hidden whitespace-nowrap">
                {original && original > pkg.price && (
                  <span className="text-[10px] sm:text-[11px] font-medium leading-none text-gray-400 line-through">
                    {formatPrice(original)}
                  </span>
                )}
                <span className="shrink-0 text-[15px] sm:text-[16px] font-bold leading-none text-ink">
                  {formatPrice(pkg.price)}
                </span>
                <span className="shrink-0 text-[10px] font-medium leading-none text-gray-400">
                  /person
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-ink">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
                <span>{pkg.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

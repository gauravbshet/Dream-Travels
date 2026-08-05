"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
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
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-12">
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
  const discount =
    original && original > pkg.price
      ? Math.round(((original - pkg.price) / original) * 100)
      : null;

  return (
    <Link
      href={`/packages/${pkg.slug ?? pkg.id}`}
      className="group block w-[262px] shrink-0 snap-start sm:w-[290px] lg:w-[310px]"
    >
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className="spotlight lit-edge flex h-full flex-col overflow-hidden rounded-[14px] border border-border bg-surface"
      >
        <div data-tone="dark" className="relative aspect-[16/11] w-full overflow-hidden">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 80vw, 310px"
            className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.022_158/0.48)] via-transparent to-transparent" />

          {/* Rank is the section's whole premise — show it. */}
          <span className="absolute left-3 top-3 z-[3] flex h-7 min-w-7 items-center justify-center rounded-full bg-[oklch(0.16_0.022_158/0.78)] px-2 text-[12px] font-semibold text-ink backdrop-blur-md">
            {rank}
          </span>

          {discount && (
            <span className="absolute left-12 top-3 z-[3] rounded-full bg-amber px-2.5 py-1 text-[11px] font-semibold text-bg-deep">
              {discount}% off
            </span>
          )}

          <WishlistButton className="absolute right-3 top-3 z-[3]" />

          <span className="absolute bottom-3 left-3 z-[3] text-[13px] font-medium text-ink-2">
            {pkg.location}
          </span>
        </div>

        <div className="relative z-[3] flex flex-1 flex-col p-4">
          <h3 className="font-display text-[17px] leading-snug text-ink line-clamp-2">
            {pkg.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-[13px]">
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Star className="h-3.5 w-3.5 fill-amber text-amber" />
              {pkg.rating.toFixed(1)}
            </span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{pkg.duration}</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{pkg.reviews} reviews</span>
          </div>

          <div className="mt-auto flex items-baseline gap-2 pt-4">
            <span className="text-lg font-semibold text-ink">
              {formatPrice(pkg.price)}
            </span>
            {original && original > pkg.price && (
              <span className="text-[13px] text-ink-muted line-through">
                {formatPrice(original)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

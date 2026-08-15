"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { packages as staticPackages, type Package } from "@/data/packages";
import { cldUrl } from "@/lib/cloudinary";

/**
 * Compact "featured stories" style tile strip — small square photo tiles
 * with just a title overlay, no price/rating. Sits between the hero intro
 * and the fuller package carousels, giving a quick magazine-style scan of
 * top trips before the detailed cards further down.
 */
export function FeaturedHighlights({
  packages = staticPackages,
}: {
  packages?: Package[];
}) {
  const highlights = packages.slice(0, 6);

  if (highlights.length === 0) return null;

  return (
    <Section tone="light">
      <Container>
        <SectionHeading
          title="Featured Right Now"
          description="A quick look at trips travellers are loving this season."
        />
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {highlights.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.slug ?? pkg.id}`}
              className="group relative aspect-square w-[42vw] shrink-0 snap-start overflow-hidden rounded-[16px] xs:w-[38vw] sm:w-auto"
            >
              <Image
                src={cldUrl(pkg.image, 450)}
                alt={pkg.title}
                fill
                sizes="(max-width: 640px) 45vw, 220px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute left-2 top-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                {pkg.category}
              </span>
              <h3 className="absolute inset-x-2 bottom-2 line-clamp-2 text-xs font-bold leading-snug text-white sm:text-sm">
                {pkg.title}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

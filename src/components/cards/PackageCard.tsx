"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, Car, ArrowUpRight } from "lucide-react";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Rating } from "@/components/ui/Rating";
import { useSpotlight } from "@/lib/useSpotlight";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Package } from "@/data/packages";

export function PackageCard({
  pkg,
  className,
}: {
  pkg: Package;
  className?: string;
}) {
  const href = `/packages/${pkg.slug ?? pkg.id}`;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <Link href={href} className={cn("group block", className)}>
      {/* No entrance gating: these live inside horizontal scrollers, where
          off-screen cards would never intersect and never un-hide. */}
      <article className="h-full">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-col overflow-hidden rounded-[14px] border border-border bg-surface"
        >
          <div data-tone="dark" className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 768px) 85vw, (max-width: 1280px) 45vw, 24vw"
              className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {/* Anchors the image into the dark surface instead of floating on it. */}
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.022_158/0.42)] via-transparent to-transparent" />

            <WishlistButton className="absolute right-3 top-3 z-[3]" />

            <span className="absolute left-3 top-3 z-[3] rounded-full border border-white/20 bg-[oklch(0.16_0.022_158/0.7)] px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur-md">
              {pkg.category}
            </span>

            <span className="absolute bottom-3 left-3 z-[3] flex items-center gap-1.5 text-[11px] font-medium text-ink-2">
              <Clock className="h-3 w-3 text-canopy" />
              {pkg.duration}
            </span>
          </div>

          <div className="relative z-[3] flex flex-1 flex-col p-5">
            <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-canopy">
              <Car className="h-3 w-3" />
              {pkg.pickup}
            </span>

            <h3 className="font-display mt-2 text-[19px] leading-snug text-ink">
              {pkg.title}
            </h3>

            <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-muted">
              <MapPin className="h-3.5 w-3.5" />
              {pkg.location}
            </span>
            <span className="mt-0.5 text-[13px] text-ink-muted">{pkg.dates}</span>

            <div className="mt-3">
              <Rating value={pkg.rating} reviews={pkg.reviews} />
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
              <div>
                <p className="text-[11px] text-ink-muted">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-ink">
                    {formatPrice(pkg.price)}
                  </span>
                  {pkg.originalPrice && (
                    <span className="text-xs text-ink-muted line-through">
                      {formatPrice(pkg.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-canopy px-4 py-2 text-xs font-semibold text-white transition-transform duration-[320ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-x-0.5">
                Book
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

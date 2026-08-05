"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Star, Flame } from "lucide-react";
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
  const original = pkg.originalPrice ?? pkg.original_price;

  return (
    <Link href={href} className={cn("group block", className)}>
      <article className="h-full">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-col overflow-hidden rounded-[12px] sm:rounded-[14px] border border-border/70 bg-surface shadow-2xs transition-all duration-300 hover:shadow-md hover:border-canopy/30"
        >
          {/* Image & Overlay Badges Header */}
          <div data-tone="dark" className="relative aspect-[1.25/1] w-full overflow-hidden">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 640px) 170px, 250px"
              className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

            {/* Top Left: Category Badge */}
            <span className="absolute left-2 top-2 z-[3] rounded-md bg-canopy/90 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white backdrop-blur-md shadow-2xs">
              {pkg.category}
            </span>

            {/* Top Right: Floating Wishlist Heart */}
            <WishlistButton className="absolute right-2 top-2 z-[3] rounded-full bg-black/30 p-1 sm:p-1.5 text-white backdrop-blur-md hover:bg-black/50" />

            {/* Bottom Left: Duration Badge Overlay */}
            <span className="absolute bottom-2 left-2 z-[3] rounded-xs bg-black/75 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wide text-white backdrop-blur-md">
              {pkg.duration}
            </span>
          </div>

          {/* Brand Emblem Accent */}
          <div className="relative -mt-2.5 ml-2.5 z-[4] flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-canopy text-white shadow-sm ring-2 ring-surface">
            <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-white text-white" />
          </div>

          {/* Card Details Body */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-2.5 sm:p-3 pt-0.5 sm:pt-1">
            <div>
              {/* Title */}
              <h3 className="font-sans text-[12.5px] sm:text-[13.5px] font-bold leading-snug tracking-tight text-ink line-clamp-2 group-hover:text-canopy transition-colors">
                {pkg.title}
              </h3>

              {/* Location Row */}
              <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-ink-muted">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-canopy shrink-0" />
                <span className="truncate">{pkg.location}</span>
              </div>

              {/* Date & Batches Row */}
              <div className="mt-0.5 flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-medium text-ink-muted">
                <div className="flex items-center gap-1 truncate">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500 shrink-0" />
                  <span className="truncate">{pkg.dates}</span>
                </div>
                <span className="shrink-0 rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  +4 Batches
                </span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
              <div className="flex items-baseline gap-0.5">
                {original && original > pkg.price && (
                  <span className="text-[10px] sm:text-[11px] text-ink-muted line-through mr-0.5">
                    {formatPrice(original)}
                  </span>
                )}
                <span className="text-[13.5px] sm:text-[14.5px] font-extrabold text-ink">
                  {formatPrice(pkg.price)}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-normal text-ink-muted">
                  /person
                </span>
              </div>

              <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-ink">
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

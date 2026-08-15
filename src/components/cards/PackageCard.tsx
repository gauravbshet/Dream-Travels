"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Star, Flame } from "lucide-react";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Rating } from "@/components/ui/Rating";
import { useSpotlight } from "@/lib/useSpotlight";
import { formatPrice, cn } from "@/lib/utils";
import { categoryLabels, type CategorySlug } from "@/data/categories";
import type { Package } from "@/data/packages";

export function PackageCard({
  pkg,
  className,
  variant = "default",
}: {
  pkg: Package;
  className?: string;
  variant?: "default" | "compact";
}) {
  const href = `/packages/${pkg.slug ?? pkg.id}`;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const original = pkg.originalPrice ?? pkg.original_price;
  const isCompact = variant === "compact";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col h-full shrink-0 w-[200px] sm:w-[225px] snap-start",
        className
      )}
    >
      <article className="flex flex-col h-full flex-1">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-1 flex-col overflow-hidden rounded-[16px] border border-border/70 bg-surface shadow-2xs transition-all duration-300 hover:shadow-md hover:border-canopy/30"
        >
          {/* Image & Overlay Badges Header */}
          <div
            data-tone="dark"
            className="relative h-[135px] w-full overflow-hidden rounded-t-[16px] shrink-0 sm:h-[150px]"
          >
            {pkg.image && pkg.image.trim() !== "" ? (
              <Image
                src={pkg.image}
                alt={pkg.title}
                fill
                sizes="(max-width: 640px) 200px, 250px"
                className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
            )}
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

            {/* Top Left: Category & Slots Badges */}
            <div className="absolute left-2.5 top-2.5 z-[3] flex flex-col gap-1 items-start">
              <span className="rounded-md bg-canopy px-2 py-0.5 text-[9.5px] sm:text-[10px] font-semibold text-white shadow-2xs">
                {isCompact ? "Destination" : (categoryLabels[pkg.category as CategorySlug] ?? pkg.category)}
              </span>
              {(pkg.slots_left != null || pkg.slotsLeft != null) && (
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[9px] sm:text-[9.5px] font-extrabold tracking-wide text-white shadow-2xs",
                    (pkg.slots_left ?? pkg.slotsLeft) === 0
                      ? "bg-rose-600"
                      : "bg-amber-600 animate-pulse"
                  )}
                >
                  {(pkg.slots_left ?? pkg.slotsLeft) === 0
                    ? "Sold Out"
                    : `⚡ ${pkg.slots_left ?? pkg.slotsLeft} slots left`}
                </span>
              )}
            </div>

            {/* Top Right: Floating Wishlist Heart */}
            <WishlistButton className="absolute right-2.5 top-2.5 z-[3] rounded-full bg-black/30 p-1 sm:p-1.5 text-white backdrop-blur-md hover:bg-black/50" />

            {/* Bottom Left: Duration & Flame Badge Overlay */}
            <span className="absolute bottom-2.5 left-2.5 z-[3] flex items-center gap-1 rounded-full bg-canopy px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-white shadow-xs">
              <Flame className="h-3 w-3 fill-white text-white" />
              {pkg.duration}
            </span>
          </div>

          {/* Card Details Body */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-3 sm:p-3.5">
            <div className="flex flex-col justify-start">
              {/* Title with uniform single line truncate */}
              <h3 className="font-sans text-[14px] sm:text-[15px] font-bold tracking-tight text-ink truncate transition-colors group-hover:text-canopy">
                {pkg.title}
              </h3>

              {/* Location Row */}
              <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-[11.5px] font-medium text-ink-muted">
                <MapPin className="h-3 w-3 shrink-0 text-canopy" />
                <span className="truncate">{pkg.location}</span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
              <div className="flex min-w-0 items-baseline gap-1 overflow-hidden whitespace-nowrap">
                {!isCompact && original && original > pkg.price && (
                  <span className="text-[10px] sm:text-[11px] font-medium leading-none text-gray-400 line-through">
                    {formatPrice(original)}
                  </span>
                )}
                <span className="shrink-0 text-[15px] sm:text-[16px] font-extrabold leading-none text-ink">
                  {formatPrice(pkg.price)}
                </span>
                <span className="shrink-0 text-[10px] font-medium leading-none text-gray-400">
                  /person
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-ink">
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

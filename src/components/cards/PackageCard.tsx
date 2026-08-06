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
        "group flex flex-col h-full shrink-0",
        isCompact ? "w-[190px] sm:w-[210px]" : "w-[190px] sm:w-[210px]",
        className
      )}
    >
      <article className="flex flex-col h-full flex-1">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge flex h-full flex-1 flex-col overflow-hidden rounded-[14px] border border-border/70 bg-surface shadow-2xs transition-all duration-300 hover:shadow-md hover:border-canopy/30 premium-card-container"
        >
          {/* Image & Overlay Badges Header */}
          <div
            data-tone="dark"
            className={cn(
              "relative w-full overflow-hidden rounded-t-[14px] shrink-0 premium-card-img-container",
              isCompact ? "h-[126px] sm:h-[142px]" : "h-[126px] sm:h-[142px]"
            )}
          >
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 640px) 190px, 240px"
              className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

            {/* Top Left: Category Badge */}
            <span className="absolute left-2 top-2 z-[3] rounded-md bg-canopy/90 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white backdrop-blur-md shadow-2xs">
              {isCompact ? "Destination" : pkg.category}
            </span>

            {/* Top Right: Floating Wishlist Heart */}
            <WishlistButton className="absolute right-2 top-2 z-[3] rounded-full bg-black/30 p-1 sm:p-1.5 text-white backdrop-blur-md hover:bg-black/50" />

            {/* Bottom Left: Duration & Flame Badge Overlay */}
            <span className="absolute bottom-2 left-2 z-[3] flex items-center gap-1 rounded-full bg-canopy px-2 py-0.5 text-[9.5px] sm:text-[10.5px] font-bold tracking-wide text-white shadow-xs">
              <Flame className="h-3 w-3 fill-white text-white" />
              {pkg.duration}
            </span>
          </div>

          {/* Card Details Body */}
          <div className="relative z-[3] flex flex-1 flex-col justify-between p-3 sm:p-3.5 premium-card-body">
            <div className="flex flex-col justify-start">
              {/* Title with uniform min-height */}
              <h3 className="font-sans text-[13px] sm:text-[14px] font-semibold leading-[1.25] tracking-tight text-ink line-clamp-2 min-h-[34px] sm:min-h-[38px] flex items-center transition-colors group-hover:text-canopy premium-card-title">
                {pkg.title}
              </h3>

              {/* Location Row */}
              <div className="mt-1 flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium text-ink-muted premium-card-location">
                <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 text-canopy" />
                <span className="truncate">{pkg.location}</span>
              </div>
            </div>

            {/* Footer Row */}
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2 premium-card-footer">
              <div className="flex min-w-0 items-baseline gap-1 overflow-hidden whitespace-nowrap premium-card-price-container">
                {!isCompact && original && original > pkg.price && (
                  <span className="text-[10px] sm:text-[11px] font-medium leading-none text-gray-400 line-through">
                    {formatPrice(original)}
                  </span>
                )}
                <span className="shrink-0 text-[15px] sm:text-[16px] font-bold leading-none text-ink premium-card-price">
                  {formatPrice(pkg.price)}
                </span>
                <span className="shrink-0 text-[10px] font-medium leading-none text-gray-400 premium-card-price-slash">
                  /person
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 text-[11px] sm:text-[12px] font-bold text-ink premium-card-rating">
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

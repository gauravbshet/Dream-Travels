"use client";

import Link from "next/link";
import Image from "next/image";
import { Rating } from "@/components/ui/Rating";
import { useSpotlight } from "@/lib/useSpotlight";
import { formatPrice, cn } from "@/lib/utils";
import type { Destination } from "@/data/destinations";

export function DestinationCard({
  destination,
  className,
}: {
  destination: Destination;
  className?: string;
  /** @deprecated retained for call-site compatibility; tilt is no longer used. */
  tilt?: number;
}) {
  const href = `/destinations/${destination.slug ?? destination.id}`;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <Link href={href} className={cn("group block", className)}>
      {/* No entrance gating: see PackageCard. */}
      <article className="h-full">
        <div
          ref={ref}
          onPointerMove={onPointerMove}
          className="spotlight lit-edge h-full overflow-hidden rounded-[14px] border border-border bg-surface"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              sizes="(max-width: 768px) 60vw, 22vw"
              className="object-cover transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.13_0.02_158/0.92)] via-[oklch(0.16_0.022_158/0.25)] to-transparent" />

            {/* Name sits on the photograph — the place leads, the chrome follows. */}
            <div className="absolute inset-x-0 bottom-0 z-[3] p-4">
              <h3 className="font-display text-[19px] leading-tight text-ink">
                {destination.name}
              </h3>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="text-[13px] text-ink-2">
                  From {formatPrice(destination.price)}
                </span>
                <Rating value={destination.rating} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, MapPin, Car } from "lucide-react";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Rating } from "@/components/ui/Rating";
import { MagneticButton } from "@/components/ui/MagneticButton";
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

  return (
    <Link href={href} className={cn("group block", className)}>
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="group flex flex-col overflow-hidden rounded-[20px] bg-white border border-border transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] m-1.5">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 85vw, (max-width: 1280px) 45vw, 24vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <WishlistButton className="absolute right-3 top-3" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
            {pkg.category}
          </span>
          <span className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Clock className="h-3 w-3" />
            {pkg.duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 lg:p-5">
          <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
            <Car className="h-3 w-3" />
            {pkg.pickup}
          </span>
          <h3 className="mt-1.5 text-base lg:text-[19px] font-semibold text-ink tracking-[-0.01em] leading-snug line-clamp-1">
            {pkg.title}
          </h3>
          <span className="mt-1 flex items-center gap-1 text-[13px] text-text-secondary">
            <MapPin className="h-3.5 w-3.5" />
            {pkg.location}
          </span>
          <span className="mt-1 text-[13px] text-text-secondary/80">{pkg.dates}</span>

          <div className="mt-3 flex items-center justify-between">
            <Rating value={pkg.rating} reviews={pkg.reviews} />
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="text-[11px] text-text-secondary">Starting from</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-ink">
                  {formatPrice(pkg.price)}
                </span>
                {pkg.originalPrice && (
                  <span className="text-xs text-text-secondary line-through">
                    {formatPrice(pkg.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <MagneticButton className="!px-4 !py-2.5 text-xs">
              Book Now
            </MagneticButton>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

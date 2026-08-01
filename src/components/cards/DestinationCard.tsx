"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Rating } from "@/components/ui/Rating";
import { formatPrice, cn } from "@/lib/utils";
import type { Destination } from "@/data/destinations";

export function DestinationCard({
  destination,
  className,
  tilt = 0,
}: {
  destination: Destination;
  className?: string;
  tilt?: number;
}) {
  const href = `/destinations/${destination.slug ?? destination.id}`;

  return (
    <Link href={href} className={cn("group block", className)}>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4 }}
        className="rounded-[20px] border border-border bg-white overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] m-1.5">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="(max-width: 768px) 60vw, 22vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="px-4 pb-4 pt-2.5">
          <h3 className="text-lg font-semibold text-ink tracking-[-0.01em]">
            {destination.name}
          </h3>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              From {formatPrice(destination.price)}
            </span>
            <Rating value={destination.rating} />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

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
        initial={{ opacity: 0, y: 24, rotate: tilt }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -8, rotate: 0, scale: 1.02 }}
        className="group relative overflow-hidden rounded-3xl shadow-card"
      >
        <div className="relative h-64 w-full">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="(max-width: 768px) 60vw, 22vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="text-lg font-bold">{destination.name}</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm text-white/85">
              From {formatPrice(destination.price)}
            </span>
            <Rating value={destination.rating} light />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

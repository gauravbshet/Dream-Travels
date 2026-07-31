"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { banners } from "@/data/banners";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export function HeroCarousel({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % banners.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) setIndex((i) => (i - 1 + banners.length) % banners.length);
  }

  const banner = banners[index];

  return (
    <div className={cn("relative h-[440px] xs:h-[480px] w-full overflow-hidden rounded-b-[32px]", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-20 pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id + "-text"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h1 className="text-balance text-3xl xs:text-4xl font-bold text-white leading-tight">
              {banner.title}
            </h1>
            <p className="mt-2 text-white/85 text-sm xs:text-base">
              {banner.subtitle}
            </p>
            <MagneticButton className="mt-5 !px-6">Explore Now</MagneticButton>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-7 bg-white" : "w-1.5 bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { banners } from "@/data/banners";
import { cn } from "@/lib/utils";

export function HeroCarousel({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % banners.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = setInterval(next, 5200);
    return () => clearInterval(timer);
  }, [next, paused]);

  function onDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60)
      setIndex((i) => (i - 1 + banners.length) % banners.length);
  }

  const banner = banners[index];

  return (
    <div
      className={cn(
        // svh keeps the composition correct under mobile browser chrome.
        "relative h-[88svh] max-h-[760px] min-h-[560px] w-full overflow-hidden",
        className
      )}
    >
      {/* Opacity is never animated here: a paused or dropped animation must not
          be able to leave the hero blank. Only scale moves. */}
      <motion.div
        key={banner.id}
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragStart={() => setPaused(true)}
        onDragEnd={(e, info) => {
          onDragEnd(e, info);
          setPaused(false);
        }}
      >
        <Image
          src={banner.image}
          alt={banner.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Legibility veil, then a dissolve into the page ground so there is no seam. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.13 0.02 158 / 0.72) 0%, oklch(0.14 0.02 158 / 0.25) 32%, oklch(0.15 0.021 158 / 0.72) 68%, oklch(0.16 0.022 158) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 pt-24">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 text-[12px] text-ink-2 backdrop-blur-md">
          <Star className="h-3.5 w-3.5 fill-amber text-amber" />
          Rated 4.9 by 75,000+ travellers
        </span>

        {/* Headline copy is never opacity-animated — it is the most important
            text on the page and must survive a dropped animation. */}
        <motion.div
          key={banner.id + "-text"}
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-balance text-[2.5rem] leading-[1.04] tracking-[-0.03em] text-ink xs:text-[2.85rem]">
            {banner.title}
          </h1>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-ink-2">
            {banner.subtitle}
          </p>
        </motion.div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#packages"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-canopy px-6 text-sm font-semibold text-bg-deep active:scale-[0.98]"
          >
            See this season&rsquo;s trips
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted">
            <MapPin className="h-3.5 w-3.5 text-canopy" />
            {banners.length} routes live now
          </span>
        </div>

        {/* Dots carry a 44px hit area while staying visually fine. */}
        <div className="mt-7 flex items-center gap-1">
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Show slide ${i + 1} of ${banners.length}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="group flex h-11 w-11 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.165,0.84,0.44,1)]",
                  i === index ? "w-7 bg-canopy" : "w-1.5 bg-ink/45"
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

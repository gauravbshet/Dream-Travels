"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { HeroSearch, HeroSearchCompact } from "./HeroSearch";
import { HeroCarousel } from "./HeroCarousel";
import { unsplash, IMG } from "@/data/images";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Terrain parallax: the photograph recedes slower than the copy over it.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.45]);

  return (
    <section className="relative -mt-[76px] lg:-mt-[84px]">
      {/* Mobile / tablet: swipeable carousel hero */}
      <div className="lg:hidden">
        <HeroCarousel />
        <div className="container-app relative z-10 -mt-7">
          <HeroSearchCompact />
        </div>
      </div>

      {/* Desktop: full-bleed immersive hero that dissolves into the ground */}
      <div ref={ref} className="relative hidden lg:block">
        <div className="relative h-[86vh] max-h-[860px] min-h-[620px] w-full overflow-hidden">
          <motion.div
            style={reduced ? undefined : { y: imageY }}
            className="absolute inset-0 -top-[10%] h-[120%]"
          >
            <Image
              src={unsplash(IMG.hero1, 2400)}
              alt="Shola forest ridges under low cloud above Chikmagalur, Karnataka"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          {/* Directional darkening for copy legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(96deg, oklch(0.13 0.02 158 / 0.88) 0%, oklch(0.14 0.02 158 / 0.5) 46%, oklch(0.16 0.022 158 / 0.12) 100%)",
            }}
          />
          {/* Dissolve into the page ground so the hero has no seam */}
          <div
            className="absolute inset-x-0 bottom-0 h-56"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, oklch(0.16 0.022 158 / 0.75) 62%, oklch(0.16 0.022 158) 100%)",
            }}
          />
          <motion.div
            style={reduced ? undefined : { opacity: veil }}
            className="absolute inset-0 bg-[oklch(0.16_0.022_158)]"
          />

          <div className="container-app relative flex h-full items-center">
            <motion.div
              style={reduced ? undefined : { y: copyY }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[13px] text-ink-2 backdrop-blur-md"
              >
                <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                Rated 4.9 by 75,000+ travellers
              </motion.div>

              <motion.h1
                initial={{ y: 22 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="display-hero text-ink"
              >
                Go where the map
                <br />
                stops being useful.
              </motion.h1>

              <motion.p
                initial={{ y: 18 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                className="prose-measure mt-6 max-w-lg text-lg leading-relaxed text-ink-2"
              >
                Multi-day trips through the forests, high passes and coastlines of
                India — planned to the pickup point, led by people who live there.
              </motion.p>

              <motion.div
                initial={{ y: 18 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.85, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#packages"
                  className="group inline-flex items-center gap-2 rounded-full bg-canopy px-7 py-4 text-sm font-semibold text-bg-deep transition-colors duration-[320ms] hover:bg-[oklch(0.82_0.16_148)]"
                >
                  See this season&rsquo;s trips
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-[320ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <span className="inline-flex items-center gap-2 text-[13px] text-ink-muted">
                  <MapPin className="h-4 w-4 text-canopy" />
                  Shot in Chikmagalur, Karnataka
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
          className="container-app relative z-10 -mt-14"
        >
          <HeroSearch />
        </motion.div>
      </div>
    </section>
  );
}

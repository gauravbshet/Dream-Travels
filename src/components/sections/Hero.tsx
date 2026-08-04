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

      {/* Desktop: inset rounded-card hero, image framed with margin on every side */}
      <div ref={ref} className="relative hidden pt-8 lg:block">
        <div className="container-app">
          <div className="relative h-[78vh] max-h-[760px] min-h-[560px] w-full overflow-hidden rounded-[28px]">
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

            {/* Directional darkening for copy legibility — neutral, not brand-tinted */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(96deg, oklch(0.08 0 0 / 0.72) 0%, oklch(0.1 0 0 / 0.4) 46%, oklch(0.12 0 0 / 0.08) 100%)",
              }}
            />
            <motion.div
              style={reduced ? undefined : { opacity: veil }}
              className="absolute inset-0 bg-black"
            />

            {/* Location pill, top-right */}
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-6 top-6 z-[2] inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] text-white backdrop-blur-md"
            >
              <MapPin className="h-3.5 w-3.5 text-canopy" />
              Chikmagalur, Karnataka
            </motion.div>

            <div className="relative flex h-full items-center px-8 xl:px-14">
              <motion.div
                style={reduced ? undefined : { y: copyY }}
                className="max-w-2xl"
              >
                <motion.div
                  initial={{ y: 14 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] text-white backdrop-blur-md"
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
                  Explore Beyond
                  <br />
                  the Ordinary.
                </motion.h1>

                <motion.p
                  initial={{ y: 18 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="prose-measure mt-6 max-w-lg text-lg leading-relaxed text-ink-2"
                >
                  Discover forests, wildlife and unforgettable journeys curated by
                  Dream Travels.
                </motion.p>

                <motion.div
                  initial={{ y: 18 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-9 flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#packages"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-bg-deep transition-colors duration-[320ms] hover:bg-white"
                  >
                    Explore Destinations
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-[320ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 -mt-14 px-4"
          >
            <HeroSearch />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

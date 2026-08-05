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
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.25]);

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

            {/* Soft green glass overlay for grassmorphism legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(120deg, rgba(25, 58, 25, 0.16) 0%, rgba(243, 248, 238, 0.74) 42%, rgba(255,255,255,0.08) 100%)",
              }}
            />
            <motion.div
              style={reduced ? undefined : { opacity: veil }}
              className="absolute inset-0 bg-[rgba(31,48,24,0.12)]"
            />

            {/* Location pill, top-right */}
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-6 top-6 z-[2] inline-flex items-center gap-2 rounded-full border border-[rgba(76,159,34,0.14)] bg-white/90 px-4 py-2 text-[13px] text-ink shadow-sm backdrop-blur-md"
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
                  className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(76,159,34,0.14)] bg-white/90 px-4 py-2 text-[13px] text-ink shadow-sm backdrop-blur-md"
                >
                  <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                  Rated 4.9 by 75,000+ travellers
                </motion.div>

                <motion.h1
                  initial={{ y: 22 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="display-hero text-white drop-shadow-[0_20px_30px_rgba(15,23,15,0.28)]"
                >
                  The Beautiful Green View
                  <br />
                  At <span className="text-canopy">Villa Sawah</span> Yogyakarta
                  <br />
                  Enjoy Your Holiday Here!
                </motion.h1>

                <motion.p
                  initial={{ y: 18 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="prose-measure mt-6 max-w-lg text-lg leading-relaxed text-white/85"
                >
                  Escape to Villa Sawah, where lush rice terraces meet elegant
                  villas and every stay feels like a calm, curated retreat.
                </motion.p>

                <motion.div
                  initial={{ y: 18 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-9 flex flex-wrap items-center gap-4"
                >
                  <a
                    href="#packages"
                    className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-canopy shadow-[0_20px_50px_-30px_rgba(33,62,21,0.32)] transition duration-[320ms] hover:bg-surface"
                  >
                    Explore Now
                    <ArrowUpRight className="h-4 w-4 text-canopy transition-transform duration-[320ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

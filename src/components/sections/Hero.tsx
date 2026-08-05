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

  // Scroll animations: image zoom/parallax and text fade/float
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen min-h-[680px] max-h-[1080px] overflow-hidden flex flex-col justify-center">
      {/* Background Image Container spanning full screen */}
      <motion.div
        style={reduced ? undefined : { scale: imageScale, y: imageY }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <Image
          src={unsplash(IMG.hero1, 2400)}
          alt="Shola forest ridges under low cloud above Chikmagalur, Karnataka"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark vignette & gradient overlays for visual pop & legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-40" />
      </motion.div>

      {/* Floating Location Tag Top-Right */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute right-6 top-24 lg:top-28 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs text-white backdrop-blur-md shadow-md"
      >
        <MapPin className="h-3.5 w-3.5 text-canopy" />
        <span>Chikmagalur, Karnataka</span>
      </motion.div>

      {/* Hero Content Container */}
      <div className="container-app relative z-10 pt-24 pb-20 lg:pb-16 flex flex-col justify-center h-full max-w-6xl">
        <motion.div
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
          className="max-w-3xl"
        >
          {/* Rating Pill */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 sm:mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-md"
          >
            <Star className="h-3.5 w-3.5 fill-amber text-amber" />
            <span>Rated 4.9 by 75,000+ happy travellers</span>
          </motion.div>

          {/* Display Heading */}
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md"
          >
            Discover Extraordinary
            <br />
            Destinations &amp; <span className="text-canopy underline decoration-canopy/40 underline-offset-8">Unforgettable</span> Trips
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-lg text-gray-200 leading-relaxed drop-shadow-sm font-normal"
          >
            Curated community trips, serene campsites, and luxury nature escapes designed for memories that last a lifetime.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#packages"
              className="group inline-flex items-center gap-2 rounded-full bg-canopy hover:bg-canopy-hover px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-canopy/40 hover:-translate-y-0.5"
            >
              Explore All Trips
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Search Floating Bar */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-5xl"
        >
          <div className="hidden sm:block">
            <HeroSearch />
          </div>
          <div className="sm:hidden">
            <HeroSearchCompact />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { HeroSearch, HeroSearchCompact } from "./HeroSearch";
import heroImage from "../../../media/hero.png";

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
          src={heroImage}
          alt="Scenic hero image for Dream Travels"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark vignette & gradient overlays for visual pop & legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-40" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="container-app relative z-20 pt-24 pb-28 sm:pb-32 lg:pb-36 flex flex-col justify-between h-full max-w-6xl">
        <div>
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
        </div>

        {/* Hero Search Floating Bar */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 mt-6 sm:mt-8 mx-auto w-full max-w-full px-4 sm:px-6 lg:max-w-5xl -translate-y-4 sm:-translate-y-6 lg:-translate-y-8"
        >
          <div className="hidden sm:block">
            <HeroSearch />
          </div>
          <div className="sm:hidden">
            <HeroSearchCompact />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[9.5vw] min-h-[38px] max-h-[60px] md:h-[12vw] md:min-h-[68px] md:max-h-[110px] lg:h-[14.5vw] lg:min-h-[110px] lg:max-h-[210px] overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 240" preserveAspectRatio="none" className="relative h-full w-full">
          <defs>
            <linearGradient id="hero-curve-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="28%" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
            <filter id="hero-curve-shadow" x="-20%" y="-50%" width="140%" height="180%">
              <feDropShadow dx="0" dy="-8" stdDeviation="16" floodColor="#000000" floodOpacity="0.12" />
            </filter>
          </defs>

          <path
            className="hidden md:block"
            d="M0,72 C220,108 420,24 690,62 C930,98 1120,164 1440,112 L1440,240 L0,240 Z"
            fill="url(#hero-curve-gradient)"
            filter="url(#hero-curve-shadow)"
          />
          <path
            className="hidden md:block"
            d="M0,86 C220,116 420,36 690,74 C930,112 1120,178 1440,126 L1440,240 L0,240 Z"
            fill="#ffffff"
          />
          <path
            className="block md:hidden"
            d="M0,18 C300,48 1140,-10 1440,22 L1440,240 L0,240 Z"
            fill="url(#hero-curve-gradient)"
          />
        </svg>
      </div>
    </section>
  );
}

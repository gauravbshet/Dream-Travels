"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import { HeroSearch } from "./HeroSearch";
import { HeroCarousel } from "./HeroCarousel";
import { unsplash, IMG } from "@/data/images";

export function Hero() {
  return (
    <section className="relative pt-4 lg:pt-8 pb-24 lg:pb-32">
      {/* Mobile / tablet: carousel hero */}
      <div className="lg:hidden">
        <HeroCarousel />
      </div>

      {/* Desktop: contained immersive hero */}
      <div className="hidden lg:block container-app">
        <div className="relative h-[680px] rounded-[28px] overflow-hidden">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={unsplash(IMG.hero1, 2400)}
              alt="Misty forest mountains"
              fill
              priority
              sizes="1500px"
              className="object-cover"
            />
          </motion.div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,30,18,.62) 0%, rgba(10,30,18,.20) 55%, rgba(10,30,18,.02) 100%)",
            }}
          />

          {/* Location pill */}
          <div className="absolute top-7 right-7 flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 text-sm text-white">
            <MapPin className="h-3.5 w-3.5" />
            Chikmagalur, Karnataka
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center max-w-xl px-8 lg:px-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-1.5 text-xs font-medium text-white"
            >
              <Star className="h-3 w-3 fill-current" />
              Rated 4.9 by 75,000+ travellers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-balance text-5xl xl:text-6xl font-semibold leading-[1.08] text-white tracking-[-0.03em]"
            >
              Explore Beyond the Ordinary.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-md text-base lg:text-lg text-white/80 leading-relaxed"
            >
              Discover forests, wildlife and unforgettable journeys curated
              by Dream Travels.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <a
                href="#packages"
                className="inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white/90"
              >
                Explore Destinations
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 -mt-10 px-6 lg:px-10"
        >
          <HeroSearch />
        </motion.div>
      </div>
    </section>
  );
}

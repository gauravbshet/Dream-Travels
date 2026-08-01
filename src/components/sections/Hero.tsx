"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HeroSearch } from "./HeroSearch";
import { HeroCarousel } from "./HeroCarousel";
import { unsplash, IMG } from "@/data/images";

export function Hero() {
  return (
    <section className="relative">
      {/* Mobile / tablet: carousel hero (matches screenshots) */}
      <div className="lg:hidden">
        <HeroCarousel />
      </div>

      {/* Desktop: full-bleed cinematic hero */}
      <div className="hidden lg:flex relative min-h-screen items-center justify-center overflow-hidden bg-ink">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={unsplash(IMG.hero1, 2400)}
              alt="Dream destination"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        </motion.div>

        <Container className="relative z-10 flex flex-col items-center py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-balance max-w-4xl text-6xl xl:text-7xl font-bold leading-[1.03] text-white tracking-tight"
          >
            Discover, Book &amp; Explore
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg text-white/75"
          >
            Curated escapes, verified tour leaders, and all-inclusive
            packages near you. Real-time availability, instant confirmation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Contact us
            </a>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-ink transition hover:brightness-95"
            >
              Book now
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-accent">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 w-full max-w-5xl"
          >
            <HeroSearch />
          </motion.div>
        </Container>
      </div>
    </section>
  );
}

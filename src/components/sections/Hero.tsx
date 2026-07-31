"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroSearch } from "./HeroSearch";
import { HeroCarousel } from "./HeroCarousel";
import { unsplash, IMG } from "@/data/images";
import { heroBadge } from "@/data/site";

export function Hero() {
  return (
    <section className="relative">
      {/* Mobile / tablet: carousel hero (matches screenshots) */}
      <div className="lg:hidden">
        <HeroCarousel />
      </div>

      {/* Desktop: cinematic split hero */}
      <div className="hidden lg:block relative overflow-hidden bg-ink min-h-[80vh]">
        <div className="absolute inset-0">
          <Image
            src={unsplash(IMG.hero1, 2400)}
            alt="Dream destination"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        </div>

        <Container className="relative z-10 flex min-h-[80vh] items-center py-32">
          <div className="grid w-full grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur"
              >
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                Rated {heroBadge.rating} by {heroBadge.reviewCountLabel} travellers
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-balance mt-6 text-5xl xl:text-6xl font-bold leading-[1.05] text-white tracking-tight"
              >
                Your Dream Trip Starts With One Search
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-5 max-w-lg text-lg text-white/70"
              >
                Curated escapes, verified tour leaders, and all-inclusive
                packages — handpicked by Dream Travels for every kind of
                explorer.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-8 flex items-center gap-4"
              >
                <MagneticButton>Explore Packages</MagneticButton>
                <MagneticButton variant="ghost" className="!border-white/25 !text-white hover:!bg-white/10">
                  Watch Story
                </MagneticButton>
              </motion.div>

              <div className="mt-10">
                <HeroSearch />
              </div>
            </div>

            <div className="relative hidden xl:block h-[560px]">
              <FloatingImage
                src={unsplash(IMG.kashmir, 900)}
                className="absolute left-0 top-4 h-64 w-52 rotate-[-4deg]"
                delay={0.4}
              />
              <FloatingImage
                src={unsplash(IMG.goa, 900)}
                className="absolute right-2 top-32 h-72 w-56 rotate-[3deg]"
                delay={0.55}
              />
              <FloatingImage
                src={unsplash(IMG.bali, 900)}
                className="absolute left-16 bottom-0 h-60 w-52 rotate-[2deg]"
                delay={0.7}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl glass px-5 py-4 shadow-float"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{heroBadge.destinations}+ Destinations</p>
                  <p className="text-xs text-ink/60">Across {heroBadge.countries} countries</p>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function FloatingImage({
  src,
  className,
  delay = 0,
}: {
  src: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/10"
      >
        <Image src={src} alt="" fill className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

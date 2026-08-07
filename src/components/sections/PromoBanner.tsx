"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { unsplash, IMG } from "@/data/images";

export function PromoBanner() {
  return (
    <section className="py-6 sm:py-8 lg:py-12" data-tone="light">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[24px] sm:rounded-[28px]">
          <div className="relative h-[340px] w-full sm:h-[380px] lg:h-[420px]">
            <Image
              src={unsplash(IMG.roadtrip, 1800)}
              alt="Plan your next adventure with Dream Travels"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber sm:text-sm">
              Limited-time offer
            </p>
            <h2 className="display-section mt-3 max-w-lg text-2xl text-white sm:text-4xl">
              Take your longest holiday yet
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">
              Book any 5-day+ package this month and get a free airport transfer, on us.
            </p>
            <Link
              href="#packages"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Now
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

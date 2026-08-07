"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { unsplash, IMG } from "@/data/images";

/**
 * Two-block "intro" sequence that runs right after the Hero: a light,
 * headline-led block with a scattered photo collage, then a dark strip
 * pairing one large photo with two icon-led trust points. Visual language
 * (chunky rounded display type, floating circular photos, pill CTA, dark
 * forest strip with icon pairs) is adapted from a reference layout the
 * client liked, rebuilt with Dream Travels' own palette, copy, and images.
 */
export function HomeIntro() {
  return (
    <>
      {/* Block 1 — light, headline + floating photo collage */}
      <section className="relative overflow-hidden bg-surface-sage py-16 sm:py-20 lg:py-28">
        <Container className="relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="display-hero text-ink">
              Discovering Wonder, Adventure, and Life-Long Journeys
            </h2>
            <p className="prose-measure mx-auto mt-5 text-base text-ink-muted sm:text-lg">
              Every trip is a chance to explore new places, connect with fellow travellers, and
              come home with stories worth telling — curated by people who&apos;ve actually been
              there.
            </p>
            <Link
              href="#packages"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber px-7 py-3.5 text-sm font-bold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-amber/40"
            >
              Explore Our Trips
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Floating circular photos — decorative, hidden below md to keep mobile clean */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            <FloatingPhoto src={unsplash(IMG.camping, 400)} className="left-[6%] top-[18%] h-28 w-28 lg:h-32 lg:w-32" />
            <FloatingPhoto src={unsplash(IMG.mountain, 400)} className="left-[12%] bottom-[10%] h-20 w-20 lg:h-24 lg:w-24" />
            <FloatingPhoto src={unsplash(IMG.forest, 400)} className="right-[8%] top-[14%] h-24 w-24 lg:h-28 lg:w-28" />
            <FloatingPhoto src={unsplash(IMG.adventure, 400)} className="right-[14%] bottom-[8%] h-20 w-20 lg:h-24 lg:w-24" />
          </div>
        </Container>
      </section>

    </>
  );
}

function FloatingPhoto({ src, className }: { src: string; className: string }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-full border-4 border-white/80 shadow-lg ${className}`}
    >
      <Image src={src} alt="" fill sizes="160px" className="object-cover" />
    </div>
  );
}


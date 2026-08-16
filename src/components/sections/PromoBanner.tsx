import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function PromoBanner() {
  return (
    <section className="py-2.5 sm:py-3.5 lg:py-4.5" data-tone="light">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[20px] sm:rounded-[24px]">
          <div className="relative h-[260px] w-full sm:h-[300px] lg:h-[340px]">
            <Image
              src="/promo-banner.png"
              alt="Explore Karnataka Packages with Dream Travels"
              fill
              sizes="100vw"
              className="object-cover object-[75%_center] sm:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber sm:text-sm">
              Featured Region • Karnataka
            </p>
            <h2 className="display-section mt-1.5 max-w-lg text-2xl text-white sm:text-3xl">
              Explore Karnataka Packages
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
              From misty hill stations to scenic trekking trails and cascading waterfalls, discover our curated Karnataka adventures.
            </p>
            <Link
              href="/packages?q=Karnataka"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Karnataka Packages
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

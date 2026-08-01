"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { formatPrice, cn } from "@/lib/utils";
import { interestingDestinations as staticInterestingDestinations } from "@/data/destinations";
import type { MasonryDestination } from "@/data/destinations";

function DestTile({ d }: { d: MasonryDestination }) {
  return (
    <div
      className={cn(
        "group relative w-52 sm:w-60 shrink-0 overflow-hidden rounded-[20px] border border-border",
        d.span === "tall" ? "h-72 sm:h-80" : "h-52 sm:h-56"
      )}
    >
      <Image
        src={d.image}
        alt={d.name}
        fill
        sizes="(max-width: 768px) 45vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
        <p className="font-semibold text-sm">{d.name}</p>
        <p className="text-xs text-white/80">
          {formatPrice(d.price)}
          <span className="text-white/60">/Person</span>
        </p>
      </div>
    </div>
  );
}

export function InterestingDestinations({
  destinations = staticInterestingDestinations,
}: {
  destinations?: MasonryDestination[];
}) {
  const mid = Math.ceil(destinations.length / 2);
  const rowOne = destinations.slice(0, mid);
  const rowTwo = destinations.slice(mid);

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Explore More"
          title="Interesting Destinations"
          emoji="📍"
          description="A curated mosaic of places waiting to be discovered."
        />
      </Container>
      <div className="flex flex-col gap-4 sm:gap-5">
        <Marquee duration={38}>
          {rowOne.map((d) => (
            <DestTile key={d.id} d={d} />
          ))}
        </Marquee>
        <Marquee duration={44} reverse>
          {rowTwo.map((d) => (
            <DestTile key={d.id} d={d} />
          ))}
        </Marquee>
      </div>
    </Section>
  );
}

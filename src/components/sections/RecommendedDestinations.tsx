import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { recommendedDestinations } from "@/data/destinations";
import type { Destination } from "@/data/destinations";

export function RecommendedDestinations({
  destinations = recommendedDestinations,
}: {
  destinations?: Destination[];
}) {
  return (
    <Section id="destinations">
      <Container>
        <SectionHeading
          eyebrow="Handpicked"
          title="Recommended Destinations"
          emoji="❤️"
          description="Premium destinations our travellers keep coming back to."
        />
      </Container>
      <Marquee duration={48} reverse>
        {destinations.map((d, i) => (
          <DestinationCard
            key={d.id}
            destination={d}
            tilt={i % 2 === 0 ? -1.5 : 1.5}
            className="w-[220px] xs:w-[240px] sm:w-[260px] lg:w-[280px]"
          />
        ))}
      </Marquee>
    </Section>
  );
}

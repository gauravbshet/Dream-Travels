import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
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
          title="Recommended Destinations"
          description="Premium destinations our travellers keep coming back to."
        />
      </Container>
      <Container>
        <Carousel label="Recommended destinations">
          {destinations.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              className="w-[220px] shrink-0 snap-start xs:w-[240px] sm:w-[260px] lg:w-[280px]"
            />
          ))}
        </Carousel>
      </Container>
    </Section>
  );
}

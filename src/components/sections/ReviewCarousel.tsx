import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { Section } from "@/components/ui/Section";
import { reviews as staticReviews } from "@/data/reviews";
import type { Review } from "@/data/reviews";

export function ReviewCarousel({ reviews = staticReviews }: { reviews?: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <Section tone="light">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Our Travellers' Experiences"
            className="mb-2 lg:mb-3"
          />
          <div className="mb-3 lg:mb-4 flex items-center gap-2 rounded-[14px] bg-surface px-4 py-3 border border-border">
            <span className="text-2xl font-semibold text-ink">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber text-amber" />
                ))}
              </div>
              <p className="text-xs text-ink-muted">Google Rating</p>
            </div>
          </div>
        </div>

        <Carousel label="Our Travellers' Experiences">
          {reviews.map((review) => (
            <article key={review.id} className="w-[82%] xs:w-[72%] sm:w-[56%] lg:w-[360px] shrink-0 snap-start flex flex-col rounded-[14px] bg-surface p-6 border border-border">
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm text-ink/80 leading-relaxed">
                {review.review}
              </p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold text-ink">{review.name}</p>
                <p className="text-xs text-ink-muted">{review.date}</p>
              </div>
            </article>
          ))}
        </Carousel>
      </Container>
    </Section>
  );
}


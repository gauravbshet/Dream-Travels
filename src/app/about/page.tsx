import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHATSAPP_NUMBER_FORMATTED, buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About Us | Dream Travels",
  description:
    "Dream Travels plans comfortable, carefully designed trips across India — group tours, treks, family holidays and custom itineraries.",
};

// Static page: no data fetching, so it prerenders once at build time.
export const revalidate = false;

const destinations = [
  "Karnataka",
  "Maharashtra",
  "Kerala",
  "Meghalaya",
  "Kashmir",
  "Sikkim",
];

const services = [
  "Domestic holiday packages",
  "Group tours",
  "Adventure and trekking trips",
  "Family holidays",
  "Couple and honeymoon packages",
  "Weekend getaways",
  "Customised travel itineraries",
  "Hotel and accommodation arrangements",
  "Transportation and sightseeing",
  "Destination-based travel experiences",
];

const commitments = [
  {
    title: "Transparent Planning",
    body: "Clear information about itineraries, inclusions, exclusions and applicable charges.",
  },
  {
    title: "Reliable Support",
    body: "Assistance before and during your journey, subject to the services included in your booking.",
  },
  {
    title: "Memorable Experiences",
    body: "Carefully planned trips designed to help you explore more and enjoy your journey.",
  },
  {
    title: "Traveller Safety",
    body: "We work with our travel partners and service providers to maintain appropriate safety standards. However, certain travel experiences may be affected by weather, road conditions, government restrictions or other circumstances beyond our control.",
  },
];

export default function AboutPage() {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-14 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          title="Welcome to Dream Travels"
          description="Travel is more than simply visiting a destination — it is about discovering new places, creating unforgettable memories and experiencing every journey in a meaningful way."
        />

        <p className="mt-6 text-sm leading-relaxed text-ink-2 sm:text-base">
          We are a travel company dedicated to creating carefully planned,
          comfortable and memorable travel experiences for individuals, couples,
          families and groups. From peaceful escapes and adventure trips to
          curated holiday packages, we aim to make your journey simple,
          enjoyable and hassle-free.
        </p>

        {/* Destinations */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Our Destinations
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            We offer thoughtfully designed travel experiences across some of
            India&apos;s most beautiful destinations, including:
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {destinations.map((place) => (
              <li
                key={place}
                className="rounded-full border border-border/70 bg-gradient-to-b from-surface to-surface-sage/60 px-3.5 py-1.5 text-[13px] font-semibold text-ink-2"
              >
                {place}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-muted">
            Destinations vary based on seasonal availability and traveller
            requirements.
          </p>
        </section>

        {/* What we offer */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            What We Offer
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Our services may include:
          </p>
          <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex items-start gap-2 text-sm text-ink-2"
              >
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-canopy"
                />
                {service}
              </li>
            ))}
          </ul>
        </section>

        {/* Approach */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Our Approach
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            Every traveller has different expectations. That&apos;s why we focus
            on creating trips that balance experience, comfort, safety and
            value.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            Our team works to understand your travel requirements and provide
            suitable itineraries, accommodation, transportation and activities
            according to the selected package.
          </p>
        </section>

        {/* Commitment */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Our Commitment
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="rounded-[16px] border border-border/70 bg-surface/70 p-4"
              >
                <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-12 rounded-[20px] border border-border/70 bg-surface-sage/40 p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Travel With Us
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            Whether you&apos;re planning a weekend escape, an adventurous
            mountain journey, a relaxing holiday or a group expedition, Dream
            Travels is here to help turn your travel plans into memorable
            experiences.
          </p>
          <p className="mt-4 text-sm font-semibold text-ink">
            Dream Travels — Wander far, wonder well.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={buildWhatsAppLink(
                "Hello! I'd like to know more about your trips."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-canopy-hover"
            >
              Talk to us on WhatsApp
            </a>
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-canopy/40"
            >
              Browse destinations
            </Link>
          </div>

          <p className="mt-4 text-xs text-ink-muted">
            Or reach us directly on {WHATSAPP_NUMBER_FORMATTED}.
          </p>
        </section>
      </Container>
    </main>
  );
}

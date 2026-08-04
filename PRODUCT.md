# Product

## Register

brand

## Users

Indian travellers aged 22–45 planning experience-led domestic trips — Kashmir, Ladakh, Spiti, Meghalaya, Kerala, Goa, the Andamans. They arrive on phones, usually mid-consideration: they already want to go somewhere, they're deciding who to go with. Solo travellers, friend groups, couples and families all appear in the same funnel.

The job to be done is confidence. They need to believe a stranger's itinerary is worth ₹20,000–₹50,000 and several days of leave. Price matters, but trust and specificity — real dates, real pickup points, real tour leaders — close the deal.

## Product Purpose

Dream Travels sells curated multi-day trips. The site is the storefront and the primary sales surface: it has to make a place feel worth going to, then make booking feel low-risk and immediate. Success is a booking, not a session.

Because the product is an experience rather than an object, the site's imagery and atmosphere *are* the product demo. A visitor should feel the place before they read the price.

## Brand Personality

Expedition-grade, unhurried, precise. The voice of someone who has actually been there and takes the logistics seriously — not a marketplace aggregator and not a luxury concierge. Warm about the destination, exacting about the details.

Emotional goal: the specific pull of a place at dusk, backed by the calm of knowing someone competent has planned it.

## Anti-references

- **Airy-white travel-marketplace layout** — near-white background, tinted card grid, pastel accents, "Explore" everywhere. The category's first reflex; it makes every operator look interchangeable.
- **Dark-and-gold luxury safari** — deep charcoal with gilt serif display type. The second-order trap: it escapes the white default and lands in an equally saturated one, and it misprices a ₹25,000 trip as a ₹250,000 one.
- **OTA density** — Booking/MakeMyTrip urgency badges, strikethrough spam, "3 people viewing this".
- **Editorial-magazine affectation** — display-serif italic drop caps and ruled columns. Wrong register for a company that sells logistics.
- Uppercase tracked eyebrows above every section, and identical repeated card grids.

## Design Principles

1. **The place leads.** Photography and atmosphere carry the page; typography and UI serve them. Never a colored block where a photograph belongs.
2. **Specifics build trust.** Real pickup points, real dates, named tour leaders and honest counts beat adjectives. Concrete detail is the conversion mechanism.
3. **Instrument, not ornament.** Interactive and decorative elements reference field equipment — contour lines, headlamp light, compass bearings — and stay legible as information rather than decoration.
4. **Committed atmosphere.** The surface is drenched in deep forest rather than hedged with neutrals. Confidence in the palette signals confidence in the product.
5. **Motion suggests terrain.** Movement evokes depth, light and landscape — parallax, drifting light, revealing horizon — never generic UI bounce.

## Accessibility & Inclusion

- Target WCAG 2.1 AA. Body text ≥4.5:1 and large text ≥3:1 against the deep surfaces; verified rather than assumed, since light-on-dark is where contrast quietly fails.
- Every animation — including cursor-reactive backgrounds and parallax — needs a `prefers-reduced-motion: reduce` path that degrades to a static or crossfaded state.
- Cursor-driven effects are strictly decorative enhancement. No information or affordance may exist only in a pointer-reactive layer, since touch and keyboard users never trigger it.
- Visible focus states on the dark surface, distinct from hover.
- Light-on-dark type gets extra line-height, as light type reads lighter than its nominal weight.

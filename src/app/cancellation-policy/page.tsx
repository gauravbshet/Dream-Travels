import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHATSAPP_NUMBER_FORMATTED, buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Dream Travels",
  description:
    "Cancellation charges, non-refundable amounts, weather and force majeure terms, refund processing and booking transfer conditions.",
};

// Static legal page with no data fetching — prerendered once at build time.
export const revalidate = false;

// Dated on publication. Update both when the policy text next changes.
const EFFECTIVE_DATE = "15 August 2026";
const LAST_UPDATED = "15 August 2026";

// Reproduced exactly as supplied by the business, including the column
// heading. Note that these are stated as *charges*, so the figure is what is
// retained, not what is returned.
const cancellationCharges = [
  { period: "30 days or more before departure", charge: "90% of total package cost" },
  { period: "21–29 days before departure", charge: "75% of total package cost" },
  { period: "15–20 days before departure", charge: "50% of total package cost" },
  { period: "8–14 days before departure", charge: "25% of total package cost" },
  { period: "4–7 days before departure", charge: "0% of total package cost" },
  { period: "0–3 days before departure / No-show", charge: "0% of total package cost" },
];

const nonRefundable = [
  "Hotel cancellation charges",
  "Transportation cancellation charges",
  "Trek or activity permits",
  "Entry tickets",
  "Government fees",
  "Booking/convenience charges",
  "Payment gateway charges, where applicable",
  "Any non-refundable supplier charges",
];

const forceMajeure = [
  "Heavy snowfall",
  "Landslides",
  "Floods",
  "Heavy rainfall",
  "Road closures",
  "Government restrictions",
  "Natural disasters",
  "Severe weather",
  "Local authority restrictions",
  "Political disturbances",
  "Transport disruptions",
  "Other force majeure circumstances",
];

const unusedServices = [
  "Unused hotel nights",
  "Missed transportation",
  "Missed sightseeing",
  "Unused meals",
  "Unused activities",
  "Early departure",
  "Personal changes to the itinerary",
];

const noShowCases = [
  "Arrives late at the departure point",
  "Misses the scheduled pickup",
  "Fails to report for departure",
  "Does not attend the trip without prior notice",
  "Is unable to travel due to personal circumstances after the applicable cancellation deadline",
];

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 scroll-mt-28" id={`section-${n}`}>
      <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
        <span className="mr-2 font-mono text-sm text-ink-muted/60">{n}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-2">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span
            aria-hidden
            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-canopy"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function CancellationPolicyPage() {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-14 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          title="Refund & Cancellation Policy"
          description="We understand that travel plans can change. This policy sets out clear terms for cancellations, postponements and refunds."
        />
        <p className="mt-3 text-xs text-ink-muted">
          Effective date: {EFFECTIVE_DATE}
        </p>

        <Section n={1} title="Customer Cancellation">
          <p>
            If a customer cancels a confirmed booking, cancellation charges will
            apply based on the time remaining before the scheduled departure
            date.
          </p>

          <div className="overflow-x-auto">
            <div className="mt-2 min-w-[420px] overflow-hidden rounded-[16px] border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-sage">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-ink sm:px-5">
                      Cancellation period
                    </th>
                    <th className="px-4 py-3 font-semibold text-ink sm:px-5">
                      Cancellation charge
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {cancellationCharges.map((row) => (
                    <tr key={row.period}>
                      <td className="px-4 py-3.5 align-top text-ink-2 sm:px-5">
                        {row.period}
                      </td>
                      <td className="px-4 py-3.5 align-top font-semibold text-ink sm:px-5">
                        {row.charge}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-ink-muted">
            Note: the above percentages are standard guidelines. Actual
            cancellation charges may vary depending on hotel, transportation,
            activity, airline, trek permit and other supplier cancellation
            policies.
          </p>
        </Section>

        <Section n={2} title="Non-Refundable Amounts">
          <p>
            Certain amounts may be non-refundable once a booking has been
            confirmed, including:
          </p>
          <BulletList items={nonRefundable} />
          <p>Such amounts may be deducted from the refundable amount.</p>
        </Section>

        <Section n={3} title="Cancellation by Dream Travels">
          <p>
            If Dream Travels cancels a trip due to operational reasons, we will,
            wherever reasonably possible, offer the customer:
          </p>
          <BulletList
            items={[
              "An alternative travel date, or",
              "An alternative itinerary/package, or",
              "A refund of the eligible amount after deduction of amounts already paid to third-party suppliers and other non-refundable charges.",
            ]}
          />
        </Section>

        <Section
          n={4}
          title="Weather, Landslide, Snowfall, Floods & Road Closures"
        >
          <p>
            Travel to destinations, particularly mountain and adventure
            destinations, may be affected by circumstances beyond our control.
            These may include:
          </p>
          <BulletList items={forceMajeure} />
          <p className="font-semibold text-ink">
            In such situations, Dream Travels cannot guarantee a full refund.
          </p>
          <p>We will make reasonable efforts to:</p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Reschedule the trip where possible;</li>
            <li>Modify the itinerary;</li>
            <li>Provide an alternative route or destination; or</li>
            <li>
              Process an eligible refund after deducting actual non-refundable
              expenses and supplier charges.
            </li>
          </ol>
          <p>
            Any refund will depend on the amount actually recoverable from
            hotels, transport operators, activity providers and other suppliers.
          </p>
        </Section>

        <Section n={5} title="Trip Postponement">
          <p>
            If a trip is postponed because of weather, road conditions,
            government restrictions or other unavoidable circumstances,
            customers may be offered an alternative date subject to
            availability.
          </p>
          <p>
            If the customer cannot travel on the revised date, the applicable
            refund will be calculated after deducting non-refundable expenses
            and supplier cancellation charges.
          </p>
        </Section>

        <Section n={6} title="Government Restrictions & Safety Decisions">
          <p>
            If local authorities, government departments, forest departments,
            tourism authorities or other competent authorities restrict access
            to a destination or activity, Dream Travels may modify, postpone or
            cancel the affected portion of the trip for safety or legal reasons.
          </p>
          <p>
            Any refund will be subject to the amount recoverable from the
            relevant service providers.
          </p>
        </Section>

        <Section n={7} title="Unused Services">
          <p>
            No refund will normally be provided for services that a customer
            voluntarily chooses not to use after the trip has commenced,
            including:
          </p>
          <BulletList items={unusedServices} />
        </Section>

        <Section n={8} title="Late Arrival & No-Show">
          <p>
            No refund will generally be provided if a customer:
          </p>
          <BulletList items={noShowCases} />
        </Section>

        <Section n={9} title="Refund Processing">
          <p>
            Approved refunds will normally be processed to the original payment
            method used for the booking.
          </p>
          <p>
            Refund processing may take 7–15 working days after approval,
            depending on the payment gateway, bank or financial institution.
          </p>
          <p>Third-party payment gateway charges may not be refundable.</p>
        </Section>

        <Section n={10} title="Transfer of Booking">
          <p>
            Where operationally possible, a booking may be transferred to
            another person subject to:
          </p>
          <BulletList
            items={[
              "Prior written approval from Dream Travels",
              "Availability",
              "Supplier terms",
              "Applicable name-change or administrative charges",
            ]}
          />
          <p>A booking transfer does not automatically guarantee a refund.</p>
        </Section>

        <Section n={11} title="Refund Eligibility">
          <p>
            The final refundable amount will be determined based on:
          </p>
          <p className="rounded-[12px] border border-border/70 bg-surface-sage/50 px-4 py-3 text-[13px] font-semibold text-ink">
            Amount Paid − Applicable Cancellation Charges − Non-Refundable
            Supplier Expenses − Applicable Fees = Refund Amount
          </p>
          <p>
            Customers will be informed of the applicable deductions wherever
            reasonably possible.
          </p>
        </Section>

        <Section n={12} title="Special Packages">
          <p>
            Certain promotional, discounted, group, trek, adventure, festival,
            peak-season and last-minute packages may have different or stricter
            cancellation and refund conditions.
          </p>
          <p>
            The cancellation terms communicated at the time of booking will
            apply to such packages.
          </p>
        </Section>

        <Section n={13} title="Disputes & Clarification">
          <p>
            Customers are encouraged to contact Dream Travels as soon as they
            become aware of any issue affecting their travel plans.
          </p>
          <p>
            Refund decisions will be made according to the booking terms,
            supplier policies, applicable laws and the circumstances of the
            cancellation.
          </p>
        </Section>

        <Section n={14} title="Contact Us">
          <p className="font-semibold text-ink">Dream Travels</p>
          {/* Only the WhatsApp/phone number is published here because it is the
              only contact detail confirmed for the business. Add the official
              email and registered address once available — a policy page is
              exactly where customers expect to find them. */}
          <p>
            Phone / WhatsApp:{" "}
            <a
              href={buildWhatsAppLink(
                "Hello! I have a question about the cancellation policy."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-canopy hover:underline"
            >
              {WHATSAPP_NUMBER_FORMATTED}
            </a>
          </p>
          <p>
            To cancel a booking, message our travel desk with your booking
            details. Cancellation charges are calculated from the date we
            receive your cancellation request, not the date of your original
            booking.
          </p>
        </Section>

        <p className="mt-12 border-t border-border pt-5 text-xs text-ink-muted">
          Last updated: {LAST_UPDATED}
        </p>
      </Container>
    </main>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

// This repo doesn't yet have a centralized WhatsApp number source on `main`
// (it exists on the unmerged feat/centralize-whatsapp-number branch) — using
// the same canonical number here so this page doesn't drift once that lands.
const WHATSAPP_NUMBER_FORMATTED = "+91 63609 41948";

export const metadata: Metadata = {
  title: "Cancellation Policy | Dream Travels",
  description: "Our refund schedule for customer-initiated trip cancellations.",
};

const refundSchedule = [
  { window: "More than 30 days before departure", refund: "90% refund of the total package cost (after deducting processing charges)" },
  { window: "21–30 days before departure", refund: "75% refund" },
  { window: "15–20 days before departure", refund: "50% refund" },
  { window: "8–14 days before departure", refund: "25% refund" },
  { window: "7 days or less before departure, no-show, or after trip commencement", refund: "No refund" },
];

export default function CancellationPolicyPage() {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading
          title="Cancellation Policy"
          description="Refunds for cancellations by the customer are processed as per the schedule below."
        />

        <div className="mt-8 overflow-hidden rounded-[16px] border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sage">
              <tr>
                <th className="px-4 py-3 font-semibold text-ink sm:px-5">Cancellation window</th>
                <th className="px-4 py-3 font-semibold text-ink sm:px-5">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {refundSchedule.map((row) => (
                <tr key={row.window}>
                  <td className="px-4 py-3.5 align-top text-ink-2 sm:px-5">{row.window}</td>
                  <td className="px-4 py-3.5 align-top font-semibold text-ink sm:px-5">{row.refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink-muted">
          To cancel a booking, message our travel desk on WhatsApp at{" "}
          <span className="font-semibold text-ink">{WHATSAPP_NUMBER_FORMATTED}</span> with your booking
          details. Refunds are calculated from the date we receive your cancellation request, not the
          date of your original booking.
        </p>
      </Container>
    </main>
  );
}

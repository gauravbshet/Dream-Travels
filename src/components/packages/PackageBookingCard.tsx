"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, MessageCircle, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function PackageBookingCard({
  slug,
  title,
  price,
  originalPrice,
  whatsappNumber,
}: {
  slug: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  whatsappNumber?: string;
}) {
  const [travellers, setTravellers] = useState(2);
  const [date, setDate] = useState("");

  const bookingHref = `/booking?package=${encodeURIComponent(slug)}&travellers=${travellers}${
    date ? `&date=${encodeURIComponent(date)}` : ""
  }`;

  const whatsappHref = `https://wa.me/${whatsappNumber ?? ""}?text=${encodeURIComponent(
    `Hello! I would like to book *${title}* for ${travellers} traveller(s)${
      date ? ` around ${date}` : ""
    }. Could you share availability and next steps?`
  )}`;

  return (
    <div className="rounded-[24px] border border-border bg-surface p-6 shadow-lg sm:p-7">
      <div className="flex items-baseline gap-2">
        {originalPrice && originalPrice > price && (
          <span className="text-sm text-ink/50 line-through">{formatPrice(originalPrice)}</span>
        )}
        <span className="text-2xl font-bold text-ink">{formatPrice(price)}</span>
        <span className="text-sm text-ink/60">/ person</span>
      </div>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">Starting from</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">Travellers</label>
          <div className="mt-2 flex items-center justify-between rounded-[12px] border border-border px-4 py-2.5">
            <button
              type="button"
              onClick={() => setTravellers((t) => Math.max(1, t - 1))}
              className="rounded-full p-1 text-ink/70 hover:bg-sage-100"
              aria-label="Decrease travellers"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-semibold text-ink">{travellers}</span>
            <button
              type="button"
              onClick={() => setTravellers((t) => Math.min(20, t + 1))}
              className="rounded-full p-1 text-ink/70 hover:bg-sage-100"
              aria-label="Increase travellers"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="travel-date" className="text-xs font-semibold uppercase tracking-wide text-ink/60">
            Travel date
          </label>
          <input
            id="travel-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-[12px] border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <Link
          href={bookingHref}
          className="flex w-full items-center justify-center rounded-[12px] bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Book Now
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-sage-100"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
        </a>
        <a
          href={`tel:${whatsappNumber ?? ""}`}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-sage-100"
        >
          <Phone className="h-4 w-4" /> Enquire / Call
        </a>
      </div>
    </div>
  );
}

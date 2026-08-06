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

  const totalPrice = price * travellers;
  const totalOriginal = originalPrice ? originalPrice * travellers : null;
  const savings = totalOriginal ? totalOriginal - totalPrice : null;

  return (
    <div className="rounded-[20px] border border-border/80 bg-surface p-6 shadow-md sm:p-7">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-ink-muted line-through">{formatPrice(originalPrice)}</span>
            )}
            <span className="text-3xl font-extrabold text-ink tracking-tight">{formatPrice(price)}</span>
            <span className="text-sm font-medium text-ink-muted">/ person</span>
          </div>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Starting price</p>
        </div>
        {savings && savings > 0 && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            Save {formatPrice(savings)}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Travellers</label>
          <div className="mt-2 flex items-center justify-between rounded-[12px] border border-border/80 bg-sage-100/50 px-4 py-2.5">
            <button
              type="button"
              onClick={() => setTravellers((t) => Math.max(1, t - 1))}
              className="rounded-full p-1 text-ink hover:bg-sage-200 transition-colors"
              aria-label="Decrease travellers"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-bold text-ink text-base">{travellers} {travellers === 1 ? "Person" : "People"}</span>
            <button
              type="button"
              onClick={() => setTravellers((t) => Math.min(20, t + 1))}
              className="rounded-full p-1 text-ink hover:bg-sage-200 transition-colors"
              aria-label="Increase travellers"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="travel-date" className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            Preferred Travel Date
          </label>
          <input
            id="travel-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-[12px] border border-border/80 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-canopy focus:ring-1 focus:ring-canopy transition-all"
          />
        </div>

        {/* Dynamic Total Price Row */}
        <div className="rounded-[12px] bg-canopy/5 border border-canopy/15 p-3.5 flex items-center justify-between">
          <span className="text-xs font-bold text-ink/80">Total Price ({travellers} {travellers === 1 ? "guest" : "guests"}):</span>
          <span className="text-lg font-extrabold text-canopy">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <Link
          href={bookingHref}
          className="flex w-full items-center justify-center rounded-[12px] bg-canopy hover:bg-canopy-hover px-5 py-3.5 text-sm font-bold text-white shadow-xs transition-colors"
        >
          Book Now — {formatPrice(totalPrice)}
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-border/80 bg-surface px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-sage-100"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
        </a>
        <a
          href={`tel:${whatsappNumber ?? ""}`}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-border/80 bg-surface px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-sage-100"
        >
          <Phone className="h-4 w-4 text-canopy" /> Enquire / Call Us
        </a>
      </div>

      <div className="mt-6 pt-5 border-t border-border/70 space-y-2 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">✓</span>
          <span>Instant Booking Confirmation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">✓</span>
          <span>Free Cancellation up to 48 hours</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">✓</span>
          <span>Best Price & Quality Guarantee</span>
        </div>
      </div>
    </div>
  );
}

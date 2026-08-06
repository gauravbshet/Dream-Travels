"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function PackageMobileBar({
  slug,
  title,
  price,
  whatsappNumber,
}: {
  slug: string;
  title: string;
  price: number;
  whatsappNumber?: string;
}) {
  const whatsappHref = `https://wa.me/${whatsappNumber ?? ""}?text=${encodeURIComponent(
    `Hello! I would like to enquire about *${title}*. Could you share availability and pricing?`
  )}`;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[180] flex items-center justify-between gap-3 rounded-[16px] border border-border/80 bg-surface/95 px-4 py-3 shadow-xl backdrop-blur-xl lg:hidden">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Starting from</p>
        <p className="text-base font-extrabold text-ink">{formatPrice(price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-[12px] border border-border/80 bg-surface p-2.5 text-ink hover:bg-sage-100 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
        </a>
        <Link
          href={`/booking?package=${encodeURIComponent(slug)}`}
          className="rounded-[12px] bg-canopy hover:bg-canopy-hover px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

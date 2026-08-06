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
    <div className="fixed inset-x-0 bottom-0 z-[200] flex items-center justify-between gap-3 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-lg lg:hidden">
      <div>
        <p className="text-[10px] uppercase tracking-wide text-ink/50">From</p>
        <p className="text-base font-bold text-ink">{formatPrice(price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-[10px] border border-border bg-surface p-3 text-ink"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-4 w-4 text-[#25D366]" />
        </a>
        <Link
          href={`/booking?package=${encodeURIComponent(slug)}`}
          className="rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

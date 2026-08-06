"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

export function BookingForm({
    packageTitle,
    defaultTravellers,
    defaultDate,
    whatsappNumber,
}: {
    packageTitle: string;
    defaultTravellers: number;
    defaultDate: string;
    whatsappNumber?: string;
}) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [travellers, setTravellers] = useState(defaultTravellers);
    const [date, setDate] = useState(defaultDate);
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        setSubmitted(true);

        const message = `Hello! I'd like to book *${packageTitle}*.\nName: ${name}\nPhone: ${phone}\nTravellers: ${travellers}${
            date ? `\nPreferred date: ${date}` : ""
        }`;
        const whatsappUrl = `https://wa.me/${whatsappNumber ?? ""}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }

    if (submitted) {
        return (
            <div className="text-center">
                <p className="text-lg font-semibold text-ink">Thanks, {name || "traveller"}!</p>
                <p className="mt-2 text-sm text-ink/70">
                    We&apos;ve opened WhatsApp with your enquiry pre-filled — send it across and our travel
                    desk will confirm availability shortly.
                </p>
                <button
                    type="button"
                    onClick={() => router.push("/packages")}
                    className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                    Browse more packages
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label htmlFor="booking-name" className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                    Full name
                </label>
                <input
                    id="booking-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-[12px] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                    placeholder="Your full name"
                />
            </div>
            <div>
                <label htmlFor="booking-phone" className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                    Phone number
                </label>
                <input
                    id="booking-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-2 w-full rounded-[12px] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                    placeholder="+91 98765 43210"
                />
            </div>
            <div>
                <label htmlFor="booking-travellers" className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                    Travellers
                </label>
                <input
                    id="booking-travellers"
                    type="number"
                    min={1}
                    max={20}
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className="mt-2 w-full rounded-[12px] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="booking-date" className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                    Preferred travel date
                </label>
                <input
                    id="booking-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 w-full rounded-[12px] border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                />
            </div>
            <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark sm:col-span-2"
            >
                <MessageCircle className="h-4 w-4" /> Send enquiry on WhatsApp
            </button>
        </form>
    );
}

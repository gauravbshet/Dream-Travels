"use client";

import { useState } from "react";
import { CheckCircle2, Send, Sparkles } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Custom Package / Itinerary");
  const [travelDate, setTravelDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Simulate inquiry submission logging
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  function handleReset() {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setTravelDate("");
    setMessage("");
  }

  if (submitted) {
    return (
      <div className="py-8 text-center flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="text-2xl font-bold text-ink">Inquiry Received!</h3>
        <p className="mt-2 text-sm text-ink-muted max-w-md">
          Thank you, <strong>{name || "Traveller"}</strong>! Our Dream Travels concierge team has received your inquiry for <strong>{inquiryType}</strong> and will contact you via WhatsApp/call within <strong>15 minutes</strong>.
        </p>

        <div className="mt-6 rounded-2xl bg-canvas/70 border border-border p-4 w-full text-left text-xs text-ink-muted space-y-1.5">
          <p className="font-semibold text-ink">Submitted Details:</p>
          <p>• Name: {name}</p>
          <p>• Phone: {phone}</p>
          <p>• Email: {email || "N/A"}</p>
          <p>• Topic: {inquiryType}</p>
          {travelDate && <p>• Preferred Travel Date: {travelDate}</p>}
          {message && <p>• Notes: {message}</p>}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-6 rounded-full bg-canopy px-6 py-2.5 text-sm font-semibold text-white hover:bg-canopy-hover transition-all shadow-md"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-ink-muted mb-1">
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arsen Smith"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-xs font-semibold text-ink-muted mb-1">
            Phone / WhatsApp Number *
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-ink-muted mb-1">
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="arsen@example.com"
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
          />
        </div>

        <div>
          <label htmlFor="contact-inquiry-type" className="block text-xs font-semibold text-ink-muted mb-1">
            Inquiry Topic
          </label>
          <select
            id="contact-inquiry-type"
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
          >
            <option value="Custom Package / Itinerary">Custom Package / Itinerary</option>
            <option value="Group Trekking & Adventure">Group Trekking & Adventure</option>
            <option value="Monsoon Special Trips">Monsoon Special Trips</option>
            <option value="Booking Confirmation & Support">Booking Confirmation & Support</option>
            <option value="Cancellation / Refund Request">Cancellation / Refund Request</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-travel-date" className="block text-xs font-semibold text-ink-muted mb-1">
          Preferred Travel Date (Optional)
        </label>
        <input
          id="contact-travel-date"
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-ink-muted mb-1">
          Trip Details / Message *
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your destination preferences, group size, or special requirements..."
          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-canopy hover:bg-canopy-hover px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        {submitting ? (
          "Sending Inquiry..."
        ) : (
          <>
            <span>Submit Travel Inquiry</span>
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

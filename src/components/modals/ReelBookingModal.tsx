"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Sparkles } from "lucide-react";

export type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reelTitle?: string;
  destination?: string;
};

export function ReelBookingModal({
  isOpen,
  onClose,
  reelTitle = "Custom Travel Package",
  destination = "India & International Destinations",
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [guests, setGuests] = useState("2 Guests");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  function handleReset() {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setTravelDate("");
    setNotes("");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-surface border border-border/80 shadow-2xl p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-ink/70 hover:bg-sage-200 hover:text-ink transition-colors"
              aria-label="Close booking modal"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="text-2xl font-bold text-ink">Inquiry Received!</h3>
                <p className="mt-2 text-sm text-ink-muted max-w-sm">
                  Thanks <strong>{name || "Traveller"}</strong>! Arsen & our team will contact you within 15 minutes to confirm your custom <strong>{destination}</strong> package details.
                </p>

                <div className="mt-6 rounded-2xl bg-sage-100/70 border border-border p-4 w-full text-left text-xs text-ink-muted space-y-1">
                  <p className="font-semibold text-ink">Trip Details Logged:</p>
                  <p>• Package: {reelTitle}</p>
                  <p>• Destination: {destination}</p>
                  <p>• Guests: {guests}</p>
                  {travelDate && <p>• Preferred Date: {travelDate}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 rounded-full bg-canopy px-6 py-2.5 text-sm font-semibold text-white hover:bg-canopy-hover transition-all shadow-md"
                >
                  Done & Back to Browsing
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-canopy font-semibold text-xs uppercase tracking-wider mb-1">
                  <Sparkles className="h-4 w-4" /> Dream Travels Concierge
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Book Your {destination} Experience
                </h2>
                <p className="text-sm text-ink-muted mt-1">
                  Featured Reel: <span className="font-medium text-ink">{reelTitle}</span>
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-muted mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Arsen Smith"
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-muted mb-1">
                        Phone Number *
                      </label>
                      <input
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
                      <label className="block text-xs font-semibold text-ink-muted mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arsen@example.com"
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-muted mb-1">
                        Travelers Count
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
                      >
                        <option value="1 Solo Traveler">1 Solo Traveler</option>
                        <option value="2 Guests (Couple/Friends)">2 Guests (Couple/Friends)</option>
                        <option value="3-5 Family/Friends">3-5 Family/Friends</option>
                        <option value="6+ Group Expedition">6+ Group Expedition</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-muted mb-1">
                      Preferred Travel Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink-muted mb-1">
                      Special Preferences / Custom Requests
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Looking for beachfront stay, adventure sports, vegetarian food..."
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-canopy focus:ring-2 focus:ring-canopy/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 w-full rounded-xl bg-canopy hover:bg-canopy-hover px-5 py-3 text-sm font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? "Sending Request..." : "Confirm & Send Inquiry"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

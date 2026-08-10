/**
 * Single source of truth for the business WhatsApp number.
 *
 * Every customer-facing WhatsApp CTA on the site resolves its number
 * through here, so the number is never hardcoded at a call site and can
 * only ever change in one place. `NEXT_PUBLIC_WHATSAPP_NUMBER` still
 * overrides it per deployment when set; the constant below is the
 * canonical fallback so a missing env var can never produce a broken
 * `wa.me/` link.
 */

/** Digits only, with country code — the format wa.me expects. */
export const WHATSAPP_NUMBER = "916360941948";

/** Human-readable form, for display in UI. */
export const WHATSAPP_NUMBER_FORMATTED = "+91 63609 41948";

/** Resolves the active number: env override if set, canonical otherwise. */
export function getWhatsAppNumber(overrideNumber?: string): string {
  const digits = (overrideNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
  return digits || WHATSAPP_NUMBER;
}

/** Builds a wa.me deep link with the message pre-filled. */
export function buildWhatsAppLink(message: string, overrideNumber?: string): string {
  return `https://wa.me/${getWhatsAppNumber(overrideNumber)}?text=${encodeURIComponent(message)}`;
}

/** Builds a `tel:` link to the same business number. */
export function buildTelLink(overrideNumber?: string): string {
  return `tel:+${getWhatsAppNumber(overrideNumber)}`;
}

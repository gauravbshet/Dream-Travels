import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { WHATSAPP_NUMBER_FORMATTED, buildWhatsAppLink } from "@/lib/whatsapp";
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Dream Travels",
  description:
    "Get in touch with Dream Travels for custom holiday packages, group trekking expeditions, and 24/7 travel support across India.",
};

const SOCIAL_INSTAGRAM = "https://www.instagram.com/dream.___.travel";
const SOCIAL_WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb9IXJA6GcG6TYOBhb2g";

export default function ContactPage() {
  return (
    <main data-tone="light" className="flex-1 bg-canvas pt-24 sm:pt-28 lg:pt-32 pb-16">
      <Container>
        {/* Header Hero */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-canopy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-canopy border border-canopy/20">
            <MessageSquare className="h-3.5 w-3.5" /> Get In Touch
          </div>
          <h1 className="display-section mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-3 text-base text-ink-muted leading-relaxed">
            Have questions about a package, custom itinerary, or group trip? Our dedicated travel concierge team is available 24/7 to assist you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: WhatsApp & Phone */}
          <div className="group rounded-[20px] border border-border/80 bg-surface p-6 shadow-2xs transition-all hover:border-canopy/40 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-600 shadow-inner">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-base text-ink">Phone & WhatsApp</h3>
            <p className="mt-1 text-xs text-ink-muted">
              Instant assistance for urgent inquiries & booking updates.
            </p>
            <div className="mt-4 space-y-1 text-sm font-bold text-ink">
              <p>{WHATSAPP_NUMBER_FORMATTED}</p>
              <a
                href={buildWhatsAppLink("Hello Dream Travels! I have an inquiry about a trip.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-canopy hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="group rounded-[20px] border border-border/80 bg-surface p-6 shadow-2xs transition-all hover:border-canopy/40 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canopy/10 text-canopy shadow-inner">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-base text-ink">Email Support</h3>
            <p className="mt-1 text-xs text-ink-muted">
              Send us your detailed trip requirements or custom plans.
            </p>
            <div className="mt-4 text-sm font-bold text-ink">
              <a href="mailto:info@dream-travels.in" className="hover:text-canopy transition-colors">
                info@dream-travels.in
              </a>
              <p className="text-[11px] font-normal text-ink-muted mt-1">Average response time: &lt; 2 hours</p>
            </div>
          </div>

          {/* Card 3: Head Office */}
          <div className="group rounded-[20px] border border-border/80 bg-surface p-6 shadow-2xs transition-all hover:border-canopy/40 hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/70 text-amber-600 shadow-inner">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-bold text-base text-ink">Headquarters</h3>
            <p className="mt-1 text-xs text-ink-muted">
              Dream Travels & Intova Groups travel operations hub.
            </p>
            <div className="mt-4 text-sm font-semibold text-ink space-y-1">
              <p>Karnataka, India</p>
              <div className="flex items-center gap-1.5 text-xs text-ink-muted font-normal pt-1">
                <Clock className="h-3.5 w-3.5 text-canopy shrink-0" />
                <span>9:00 AM – 9:00 PM IST (7 Days)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form & Sidebar Grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
          {/* Main Interactive Contact Form */}
          <div className="rounded-[24px] border border-border/80 bg-surface p-6 sm:p-8 shadow-md">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
              Send Us a Message
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Fill out the details below and our travel desk will get back to you with custom quotes.
            </p>
            <ContactForm />
          </div>

          {/* Sidebar Channels & Guarantee */}
          <div className="space-y-6">
            {/* Social Channels Card */}
            <div className="rounded-[20px] border border-border/80 bg-surface p-6 shadow-2xs">
              <h3 className="font-bold text-base text-ink flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-canopy" /> Official Community
              </h3>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                Join our official WhatsApp channel & Instagram for upcoming trip announcements, monsoon special offers, and travel stories.
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href={SOCIAL_WHATSAPP_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs font-bold text-emerald-950 hover:bg-emerald-100/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    WhatsApp Channel
                  </span>
                  <span>Join Channel →</span>
                </a>

                <a
                  href={SOCIAL_INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-pink-200 bg-pink-50/50 p-3.5 text-xs font-bold text-pink-950 hover:bg-pink-100/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <InstagramGlyph className="h-4 w-4 text-pink-600" />
                    Instagram (@dream.___.travel)
                  </span>
                  <span>Follow →</span>
                </a>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="rounded-[20px] border border-canopy/30 bg-canopy/5 p-6">
              <h3 className="font-bold text-sm text-canopy-deep flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-canopy shrink-0" /> Fast Response Guarantee
              </h3>
              <p className="mt-2 text-xs text-ink/80 leading-relaxed">
                We respect your time. All booking inquiries submitted during operating hours are responded to within <strong>15 minutes</strong>.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.13s-.01 3.07-.06 4.13c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.07-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.07 2 14.73 2 12s.01-3.07.06-4.13c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44 2.53c.64-.25 1.37-.42 2.43-.47C8.93 2.01 9.27 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 0 0-2.33 1.17 1.17 0 0 0 0 2.33Z" />
    </svg>
  );
}

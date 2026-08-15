"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

// Most of these are still placeholder ("#") — those pages don't exist yet.
// "About Us" and "Cancellation Policy" are the real pages in this list.
const footerGroups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Partner With Us", href: "#" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Kashmir", href: "#" },
      { label: "Kerala", href: "#" },
      { label: "Goa", href: "#" },
      { label: "Ladakh", href: "#" },
      { label: "Andaman", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
      { label: "Safety", href: "#" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Refund Policy", href: "/cancellation-policy" },
    ],
  },
];

function SocialGlyph({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d={path} />
    </svg>
  );
}

const socials = [
  {
    label: "WhatsApp",
    href: "https://whatsapp.com/channel/0029Vb9IXJA6GcG6TYOBhb2g",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/dream.___.travel",
    path: "M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.13s-.01 3.07-.06 4.13c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.07-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.07 2 14.73 2 12s.01-3.07.06-4.13c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44 2.53c.64-.25 1.37-.42 2.43-.47C8.93 2.01 9.27 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 0 0-2.33 1.17 1.17 0 0 0 0 2.33Z",
  },
];

export function Footer() {
  return (
    <footer id="contact" data-tone="dark" className="relative mt-2 overflow-hidden bg-surface-dark-deep border-t border-border pb-10 pt-6 lg:pb-8 lg:pt-8 text-ink-muted">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9rem] lg:text-[13rem] font-semibold tracking-tight text-ink/[0.03] select-none"
      >
        DREAM TRAVELS
      </span>
      <Container className="relative">
        <div className="grid gap-y-14 lg:grid-cols-[minmax(220px,1.9fr)_repeat(4,minmax(90px,0.7fr))_minmax(180px,1.3fr)] lg:items-start lg:gap-x-6 xl:gap-x-8">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Dream Travels Logo"
                className="h-11 w-11 object-contain rounded-full bg-white/10 p-0.5"
              />
              <span className="text-xl font-bold text-white tracking-tight">Dream Travels</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Premium, curated travel experiences designed for the modern
              explorer. Wander far, wander well.
            </p>
            <div className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-white/90">
              <Mail className="h-4 w-4 text-canopy shrink-0" />
              <a
                href="mailto:info@dream-travels.in"
                className="hover:text-canopy transition-colors"
              >
                info@dream-travels.in
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-muted transition-colors hover:bg-canopy hover:border-primary hover:text-white"
                >
                  <SocialGlyph path={s.path} />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop columns — `contents` lifts each group into a direct
              child of the outer grid so it gets its own track, instead of
              a nested 4-col grid squeezed into a single outer track. */}
          <div className="hidden lg:contents">
            {footerGroups.map((group) => (
              <div key={group.title} className="min-w-0">
                <h4 className="font-semibold text-ink">{group.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile/tablet accordion */}
          <div className="flex flex-col lg:hidden">
            {footerGroups.map((group) => (
              <FooterAccordion key={group.title} title={group.title} links={group.links} />
            ))}
          </div>

          <div className="min-w-0">
            <h4 className="font-semibold text-ink">Newsletter</h4>
            <p className="mt-4 text-sm leading-relaxed">
              Get exclusive deals and travel inspiration in your inbox.
            </p>
            <form className="mt-4 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="w-full min-w-0 rounded-[12px] border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-canopy"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-canopy text-white transition-colors hover:bg-canopy-hover"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-xs text-ink-muted">
          <div className="flex flex-col items-center justify-center text-center gap-1.5">
            <p className="text-sm font-medium text-ink">
              Made by <span className="font-semibold text-white">Intova Groups</span> for <span className="font-semibold text-white">Dream Travels</span>
            </p>
            <p className="text-xs text-ink-muted">
              © 2026 Dream Travels. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterAccordion({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left font-semibold text-ink"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {links.map((link) => (
              <li key={link.label} className="pb-3 text-sm">
                <Link href={link.href} className="hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

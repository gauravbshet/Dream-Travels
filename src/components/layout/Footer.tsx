"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

// Most of these are still placeholder ("#") — those pages don't exist yet.
// "Cancellation Policy" is the one real page in this list.
const footerGroups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
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
      { label: "Contact Us", href: "#" },
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
    label: "Facebook",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z",
  },
  {
    label: "Instagram",
    path: "M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.13s-.01 3.07-.06 4.13c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.07-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.07 2 14.73 2 12s.01-3.07.06-4.13c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44 2.53c.64-.25 1.37-.42 2.43-.47C8.93 2.01 9.27 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 0 0-2.33 1.17 1.17 0 0 0 0 2.33Z",
  },
  {
    label: "Twitter",
    path: "M22 5.9c-.68.3-1.4.5-2.16.6a3.8 3.8 0 0 0 1.66-2.1 7.5 7.5 0 0 1-2.4.92 3.77 3.77 0 0 0-6.42 3.44A10.7 10.7 0 0 1 4.7 4.9a3.77 3.77 0 0 0 1.17 5.03 3.7 3.7 0 0 1-1.71-.47v.05a3.78 3.78 0 0 0 3.02 3.7c-.53.14-1.1.16-1.68.06a3.78 3.78 0 0 0 3.52 2.62A7.57 7.57 0 0 1 2 17.5a10.7 10.7 0 0 0 5.79 1.7c6.95 0 10.75-5.76 10.75-10.75l-.01-.49A7.7 7.7 0 0 0 22 5.9Z",
  },
  {
    label: "YouTube",
    path: "M21.6 7.2s-.21-1.5-.87-2.16c-.83-.87-1.76-.87-2.19-.92C15.44 4 12 4 12 4h-.01s-3.43 0-6.53.12c-.43.05-1.36.05-2.19.92-.66.66-.87 2.16-.87 2.16S2.18 8.98 2.18 10.75v1.49c0 1.77.22 3.55.22 3.55s.21 1.5.87 2.16c.83.87 1.92.84 2.41.94 1.75.17 7.32.22 7.32.22s3.44-.01 6.53-.13c.43-.06 1.36-.06 2.19-.93.66-.66.87-2.16.87-2.16s.22-1.77.22-3.55v-1.49c0-1.77-.22-3.55-.22-3.55ZM9.95 14.6V8.9l5.6 2.86-5.6 2.85Z",
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
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
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

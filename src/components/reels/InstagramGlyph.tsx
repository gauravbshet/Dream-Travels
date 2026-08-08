// Instagram isn't part of lucide-react's icon set; this mirrors the same
// glyph already used for the footer's social links (see
// src/components/layout/Footer.tsx) so the icon stays consistent site-wide.
export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.13s-.01 3.07-.06 4.13c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.07-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.07 2 14.73 2 12s.01-3.07.06-4.13c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44 2.53c.64-.25 1.37-.42 2.43-.47C8.93 2.01 9.27 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 0 0-2.33 1.17 1.17 0 0 0 0 2.33Z" />
    </svg>
  );
}

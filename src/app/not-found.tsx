import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Site-wide 404. The package and destination routes have their own, more
 * specific not-found screens; this catches every other bad URL (old links,
 * typos, removed pages) instead of Next's unstyled default.
 */
export default function NotFound() {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-20">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <p className="font-mono text-sm font-semibold tracking-widest text-canopy">404</p>
          <h1 className="display-section mt-2 text-ink">This page doesn&apos;t exist</h1>
          <p className="prose-measure mx-auto mt-3 text-sm leading-relaxed text-ink-muted">
            The link may be out of date, or the trip may have moved. Browse our
            destinations to find where you want to go next.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-canopy-hover"
            >
              Browse destinations
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-canopy/40"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

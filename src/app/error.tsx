"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Route-level error boundary for every page that doesn't define its own.
 * Without this, an unhandled render/fetch error (Supabase unreachable, a bad
 * env var, a network blip) drops the visitor onto Next's bare error screen.
 *
 * `error.message` is deliberately not rendered: server-component messages can
 * carry internals like connection strings or env-var names, and a raw stack
 * message means nothing to a traveller anyway. The digest is shown instead so
 * a support conversation can still tie back to the server log.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-20">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <h1 className="display-section text-ink">Something went wrong</h1>
          <p className="prose-measure mx-auto mt-3 text-sm leading-relaxed text-ink-muted">
            We hit a problem loading this page. It&apos;s usually temporary —
            try again, and if it keeps happening you can reach us on WhatsApp.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-canopy-hover"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-canopy/40"
            >
              Back to home
            </Link>
          </div>

          {error.digest && (
            <p className="mt-6 text-xs text-ink-muted">
              Reference: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}

"use client";

import { Container } from "@/components/ui/Container";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main data-tone="light" className="flex-1 bg-canvas py-16">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <h2 className="display-section text-ink">Couldn&apos;t load these trips</h2>
          {/* Deliberately not `error.message`: server-component errors can
              carry internals (env-var names, connection details) and mean
              nothing to a traveller. The digest is enough to find the log. */}
          <p className="prose-measure mx-auto mt-2 text-sm text-ink-muted">
            Something went wrong while fetching packages for this category.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-canopy-hover"
          >
            Try again
          </button>
          {error.digest && (
            <p className="mt-5 text-xs text-ink-muted">
              Reference: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}

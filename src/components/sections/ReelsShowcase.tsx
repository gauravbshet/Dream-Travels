"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { ReelCard } from "@/components/reels/ReelCard";
import { ReelViewerModal } from "@/components/reels/ReelViewerModal";
import { categories } from "@/data/categories";
import { reels as staticReels, type Reel } from "@/data/reels";
import { cn } from "@/lib/utils";

export function ReelsShowcase({ reels = staticReels }: { reels?: Reel[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visibleIdsRef = useRef<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter ? reels.filter((reel) => reel.category === filter) : reels),
    [reels, filter]
  );

  const availableCategories = useMemo(
    () => categories.filter((cat) => reels.some((reel) => reel.category === cat.id)),
    [reels]
  );

  const handleVisibilityChange = useCallback(
    (id: string, inView: boolean) => {
      const set = visibleIdsRef.current;
      if (inView) {
        set.add(id);
      } else {
        set.delete(id);
      }

      setActiveId((current) => {
        // Keep whatever is currently active (auto-picked or user-selected)
        // as long as it's still on screen -- only reassign when it scrolls
        // out of view, so a manual pick isn't stomped on by every
        // intersection event from neighboring cards.
        if (current && set.has(current)) return current;
        return filtered.find((reel) => set.has(reel.id))?.id ?? null;
      });
    },
    [filtered]
  );

  const handlePlayRequest = useCallback((id: string) => setActiveId(id), []);

  const handlePauseRequest = useCallback(
    (id: string) => setActiveId((current) => (current === id ? null : current)),
    []
  );

  if (reels.length === 0) return null;

  return (
    <Section tone="light" id="reels" className="pt-1 sm:pt-2 lg:pt-3">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Travel Through Our Reels"
            description="See where our travelers are going."
          />
          {availableCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              <FilterChip label="All" active={filter === null} onClick={() => setFilter(null)} />
              {availableCategories.map((cat) => (
                <FilterChip
                  key={cat.id}
                  label={cat.label}
                  active={filter === cat.id}
                  onClick={() => setFilter(cat.id)}
                />
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink-muted">
            No reels in this category yet — check back soon.
          </p>
        ) : (
          <ResponsiveScroller
            className="mt-3 sm:mt-4"
            gridClassName="lg:grid-cols-4 xl:grid-cols-5 lg:gap-5"
          >
            {filtered.map((reel, index) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                isActive={activeId === reel.id}
                onVisibilityChange={handleVisibilityChange}
                onPlayRequest={handlePlayRequest}
                onPauseRequest={handlePauseRequest}
                onOpen={() => setOpenIndex(index)}
              />
            ))}
          </ResponsiveScroller>
        )}
      </Container>

      {openIndex !== null && (
        <ReelViewerModal
          reels={filtered}
          activeIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </Section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      suppressHydrationWarning
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-canopy text-white"
          : "border-border bg-surface text-ink-muted hover:border-primary/40 hover:text-primary"
      )}
    >
      {label}
    </button>
  );
}

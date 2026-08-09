"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Reel } from "@/data/reels";
import { InstagramGlyph } from "./InstagramGlyph";
import { normalizeUrl } from "@/lib/utils";

export function ReelViewerModal({
  reels,
  activeIndex,
  onClose,
  onNavigate,
}: {
  reels: Reel[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reel = reels[activeIndex];

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowRight" && activeIndex < reels.length - 1) {
        onNavigate(activeIndex + 1);
      } else if (event.key === "ArrowLeft" && activeIndex > 0) {
        onNavigate(activeIndex - 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reels.length, onClose, onNavigate]);

  if (!reel) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 px-3 py-4 sm:px-4 sm:py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${reel.title} reel viewer`}
      onClick={onClose}
    >
      {/* Prominent Floating Close Button Top Left */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close reel viewer"
        className="absolute left-3 top-3.5 sm:left-6 sm:top-5 z-[410] flex items-center gap-1.5 rounded-full bg-black/70 px-3.5 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:bg-black/90 active:scale-95"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Close</span>
      </button>

      {/* Prominent Floating Close Button Top Right */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close reel viewer"
        className="absolute right-3 top-3.5 sm:right-6 sm:top-5 z-[410] flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:bg-black/90 active:scale-95"
      >
        <X className="h-5 w-5" />
      </button>

      {activeIndex > 0 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(activeIndex - 1);
          }}
          aria-label="Previous reel"
          className="absolute left-2 top-1/2 z-[410] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {activeIndex < reels.length - 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate(activeIndex + 1);
          }}
          aria-label="Next reel"
          className="absolute right-2 top-1/2 z-[410] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <div
        className="relative flex aspect-[9/16] h-[min(82vh,750px)] max-h-full flex-col overflow-hidden rounded-[20px] sm:rounded-[24px] bg-black shadow-2xl border border-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Inside Reel Card: Top Close Pill for Instant Dismissal */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reel viewer"
          className="absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-md transition-colors hover:bg-black/80 active:scale-95"
        >
          <X className="h-3.5 w-3.5" />
          <span>Close</span>
        </button>

        {reel.videoUrl ? (
          <video
            key={reel.id}
            src={reel.videoUrl}
            poster={reel.thumbnailUrl ?? undefined}
            controls
            autoPlay
            playsInline
            loop
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/70">
            This reel&apos;s video is unavailable.
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-bold text-white">{reel.title}</h3>
          {reel.destination && <p className="mt-0.5 text-xs sm:text-sm text-white/80">{reel.destination}</p>}
          {reel.description && (
            <p className="mt-1 line-clamp-2 text-xs text-white/70">{reel.description}</p>
          )}
          {normalizeUrl(reel.instagramUrl ?? "") && (
            <a
              href={normalizeUrl(reel.instagramUrl ?? "")!}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <InstagramGlyph className="h-3.5 w-3.5" /> View on Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

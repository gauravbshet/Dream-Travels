"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Pause, Play } from "lucide-react";
import { InstagramGlyph } from "./InstagramGlyph";
import { useInView } from "@/lib/useInView";
import { cn, normalizeUrl, formatPrice } from "@/lib/utils";
import type { Reel } from "@/data/reels";

// Same fallback the rest of the site uses when NEXT_PUBLIC_WHATSAPP_NUMBER
// isn't set locally — keeps this card's CTA from silently linking nowhere.
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916360941948";

export function ReelCard({
  reel,
  isActive,
  onVisibilityChange,
  onPlayRequest,
  onPauseRequest,
  onOpen,
  className,
}: {
  reel: Reel;
  isActive: boolean;
  onVisibilityChange: (id: string, inView: boolean) => void;
  onPlayRequest: (id: string) => void;
  onPauseRequest: (id: string) => void;
  onOpen: () => void;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: [0, 0.6] });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    onVisibilityChange(reel.id, inView);
    // onVisibilityChange identity is stable from the parent (useCallback);
    // omitting it from deps avoids re-registering on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reel.id]);

  useEffect(() => {
    return () => onVisibilityChange(reel.id, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel.id]);

  // Playback is fully controlled by the parent's activeId: exactly one card
  // is ever "active" at a time, whether picked automatically (most-visible)
  // or by the visitor clicking Play on a specific card.
  const shouldPlay = isActive && inView && !videoError;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.play().catch(() => {
        // Autoplay can be rejected by the browser; the play/pause button
        // still lets the visitor start playback manually.
      });
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  function togglePlayback(event: React.MouseEvent) {
    event.stopPropagation();
    if (shouldPlay) {
      onPauseRequest(reel.id);
    } else {
      onPlayRequest(reel.id);
    }
  }

  const instagramUrl = normalizeUrl(reel.instagramUrl ?? "");
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello! I'm interested in the "${reel.title}"${reel.destination ? ` trip in ${reel.destination}` : " trip"}. Can you share more details?`,
  )}`;
  // No admin-provided thumbnail: ask the browser to decode a frame slightly
  // into the clip (via the #t= media fragment) and eagerly fetch enough to
  // render it, so the card still shows *something* instead of a blank tile.
  // Cards that already have a poster stay fully lazy (preload="none").
  const hasThumbnail = Boolean(reel.thumbnailUrl);
  const videoSrc =
    hasThumbnail || !reel.videoUrl ? reel.videoUrl : `${reel.videoUrl}#t=0.5`;

  return (
    <div
      className={cn(
        "flex w-[180px] shrink-0 snap-start flex-col gap-2 sm:w-[210px] lg:w-full",
        className,
      )}
    >
      <div
        ref={ref}
        className="group relative aspect-[9/16] w-full overflow-hidden rounded-[20px] border border-border/80 bg-surface-dark shadow-2xs transition-all duration-300 hover:shadow-lg"
        data-tone="dark"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen();
            }
          }}
          className="absolute inset-0 z-[1] h-full w-full cursor-pointer text-left focus:outline-none"
          aria-label={`Open ${reel.title} reel`}
        >
          {videoError || !reel.videoUrl ? (
            reel.thumbnailUrl ? (
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-dark text-xs text-white/60">
                Video unavailable
              </div>
            )
          ) : (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={reel.thumbnailUrl ?? undefined}
              muted
              loop
              playsInline
              preload={hasThumbnail ? "none" : "metadata"}
              className="h-full w-full object-cover"
              onError={() => setVideoError(true)}
            />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-black/5 to-black/25" />

        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label={`View ${reel.title} on Instagram`}
            className="absolute right-2.5 top-2.5 z-[3] flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <InstagramGlyph className="h-4 w-4" />
          </a>
        )}

        <button
          type="button"
          onClick={togglePlayback}
          aria-label={shouldPlay ? "Pause reel" : "Play reel"}
          aria-pressed={shouldPlay}
          className="absolute left-2.5 top-2.5 z-[3] flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          {shouldPlay ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-2 p-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-[13px] font-bold text-white">
              {reel.title}
            </h3>
            {reel.destination && (
              <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-white/80">
                {reel.destination}
              </p>
            )}
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label={`Enquire about ${reel.title} on WhatsApp`}
            title="Enquire on WhatsApp"
            className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-[#25D366]"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>

      {reel.linkedPackage && (
        <Link
          href={`/booking?package=${encodeURIComponent(reel.linkedPackage.slug ?? reel.linkedPackage.id)}`}
          onClick={(event) => event.stopPropagation()}
          className="group/book flex flex-col gap-1.5 rounded-[14px] border border-border/70 bg-surface p-2.5 shadow-2xs transition-colors hover:border-canopy/40"
        >
          <p className="line-clamp-1 text-[12px] font-bold text-ink">
            {reel.linkedPackage.title}
          </p>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex flex-col min-w-0">
              {reel.linkedPackage.originalPrice &&
                reel.linkedPackage.originalPrice > reel.linkedPackage.price && (
                  <span className="text-[10px] font-medium leading-none text-ink-muted line-through">
                    {formatPrice(reel.linkedPackage.originalPrice)}
                  </span>
                )}
              <span className="text-[12.5px] font-extrabold leading-tight text-ink">
                {formatPrice(reel.linkedPackage.price)}
              </span>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-canopy px-2.5 py-1 text-[10.5px] font-bold text-white transition-colors group-hover/book:bg-canopy-hover">
              Book Now
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}

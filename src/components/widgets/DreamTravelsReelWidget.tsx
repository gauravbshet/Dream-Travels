"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Minus, Sparkles, ArrowRight, Play, Pause, X, MapPin, Star } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { reels as staticReels, type Reel } from "@/data/reels";
import { ReelBookingModal } from "@/components/modals/ReelBookingModal";

export function DreamTravelsReelWidget() {
  const [reel, setReel] = useState<Reel>(staticReels[0]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isExpandedModal, setIsExpandedModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function fetchFeaturedReel() {
      try {
        const { data, error } = await supabase
          .from("reels")
          .select("id,title,destination,description,video_url,thumbnail_url,instagram_url,category,is_active,is_featured_widget")
          .eq("is_active", true)
          .order("is_featured_widget", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          setReel((prev) => ({
            ...prev,
            id: row.id,
            title: row.title,
            destination: row.destination || prev.destination,
            description: row.description || prev.description,
            videoUrl: row.video_url,
            thumbnailUrl: row.thumbnail_url || prev.thumbnailUrl,
            instagramUrl: row.instagram_url,
            category: row.category || prev.category,
            isFeaturedWidget: Boolean(row.is_featured_widget),
          }));
        }
      } catch {
        // Fallback to staticReels[0]
      }
    }

    fetchFeaturedReel();
  }, [supabase]);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }

  function togglePlay(e: React.MouseEvent) {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <>
      {/* Mobile: always the compact pill — the expanded dual-pane card is
          ~320px wide, which is most of a phone viewport and floats over
          whatever content is scrolled behind it. Tapping it opens the
          full-screen reel view instead of the floating card. */}
      <div className="fixed bottom-4 right-4 z-[180] font-sans sm:hidden">
        <button
          type="button"
          onClick={() => setIsExpandedModal(true)}
          className="group flex items-center gap-3 rounded-full border border-border bg-surface/95 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all duration-300 active:scale-95"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/40 shadow-xs shrink-0">
            {reel.thumbnailUrl ? (
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-canopy text-xs font-bold text-white">
                🏕
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-canopy uppercase tracking-wider">
                Featured Trip
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs font-bold text-ink line-clamp-1">
              {reel.title} • ₹{(reel.price ?? 2499).toLocaleString("en-IN")}
            </p>
          </div>
        </button>
      </div>

      {/* Tablet/desktop: full expand/minimize widget */}
      <div className="fixed bottom-4 right-4 z-[180] hidden font-sans sm:bottom-6 sm:right-6 sm:block">
        <AnimatePresence mode="wait">
          {isMinimized ? (
            /* Minimized Featured Package Badge Button */
            <motion.button
              key="minimized-widget"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsMinimized(false)}
              className="group flex items-center gap-3 rounded-full border border-border bg-surface/95 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all duration-300 hover:border-canopy/60"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/40 shadow-xs shrink-0">
                {reel.thumbnailUrl ? (
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-canopy text-xs font-bold text-white">
                    🏕
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-canopy uppercase tracking-wider">
                    Featured Trip
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-xs font-bold text-ink group-hover:text-canopy transition-colors line-clamp-1">
                  {reel.title} • ₹{(reel.price ?? 2499).toLocaleString("en-IN")}
                </p>
              </div>
            </motion.button>
          ) : (
            /* Dual-Pane Floating Reel & Package Card */
            <motion.div
              key="expanded-widget"
              initial={{ scale: 0.9, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="relative flex items-end gap-2.5 sm:gap-3"
            >
              {/* Left Pane: 9:16 Vertical Reel Video Frame */}
              <div
                onClick={() => setIsExpandedModal(true)}
                className="group relative h-[160px] w-[120px] sm:h-[180px] sm:w-[135px] shrink-0 overflow-hidden rounded-[20px] border border-white/20 bg-black shadow-2xl cursor-pointer"
              >
                <video
                  ref={videoRef}
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl ?? undefined}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                {/* Top Controls: Mute Toggle */}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs transition-colors hover:bg-black/90"
                  >
                    {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </button>
                </div>

                {/* Play/Pause Toggle (click here toggles playback without opening the expanded view) */}
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-xs">
                    {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
                  </div>
                </button>

                {/* Bottom Caption Pill */}
                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <div className="inline-block rounded-md bg-black/75 backdrop-blur-xs px-2 py-1 text-[10px] font-medium leading-tight text-white shadow-xs">
                    <span className="line-clamp-2">
                      {reel.description || reel.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Pane: Featured Package Details Card */}
              <div className="relative flex h-[160px] w-[190px] sm:h-[180px] sm:w-[210px] flex-col justify-between rounded-[20px] border border-border/80 bg-surface/95 p-3.5 shadow-2xl backdrop-blur-md text-ink">
                {/* Header row: Featured Reel Badge & Minimize Button */}
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1 text-[10.5px] font-bold text-canopy uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 fill-canopy/20" />
                    <span>Featured Reel</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    title="Minimize widget"
                    aria-label="Minimize widget"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-100 text-ink/60 hover:bg-sage-200 hover:text-ink transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                </div>

                {/* Middle: Destination & Package Title */}
                <div className="my-auto space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-muted">
                    <MapPin className="h-3 w-3 shrink-0 text-canopy" />
                    <span className="truncate">{reel.destination || "Maharashtra"}</span>
                  </div>

                  <h4 className="text-sm font-extrabold text-ink tracking-tight line-clamp-2 leading-snug">
                    {reel.title}
                  </h4>

                  {/* Price & Rating Row */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-extrabold text-ink text-sm">
                      ₹{(reel.price ?? 2499).toLocaleString("en-IN")}
                      <span className="text-[10px] font-normal text-ink-muted ml-0.5">/ person</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {reel.rating ?? 4.8}
                    </span>
                  </div>
                </div>

                {/* Bottom: Book Package CTA Button */}
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="group flex w-full items-center justify-between rounded-full bg-canopy hover:bg-canopy-hover px-3.5 py-2 text-xs font-semibold text-white shadow-md transition-all duration-300 active:scale-95"
                >
                  <span>Book Package</span>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Package Booking Modal */}
      <ReelBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        reelTitle={reel.title}
        destination={reel.destination ?? "Maharashtra & Featured Destinations"}
      />

      {/* Expanded Full Video Modal View */}
      <AnimatePresence>
        {isExpandedModal && (
          <div className="fixed inset-0 z-[320] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpandedModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 h-[85vh] max-h-[680px] w-full max-w-[380px] overflow-hidden rounded-3xl bg-black border border-white/20 shadow-2xl flex flex-col justify-between"
            >
              <button
                onClick={() => setIsExpandedModal(false)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/90 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <video
                src={reel.videoUrl}
                poster={reel.thumbnailUrl ?? undefined}
                autoPlay
                controls
                loop
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full bg-canopy px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                      {reel.destination || "Featured Destination"}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400">
                      ★ {reel.rating ?? 4.8}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {reel.title}
                  </h3>
                  {reel.description && (
                    <p className="mt-1 text-xs text-white/80 line-clamp-3">
                      {reel.description}
                    </p>
                  )}
                  <p className="mt-2 text-lg font-extrabold text-white">
                    ₹{(reel.price ?? 2499).toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-white/70">/ person • {reel.duration || "2D / 1N"}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsExpandedModal(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full rounded-full bg-canopy hover:bg-canopy-hover text-white py-3 font-semibold text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  Book This Experience (₹{(reel.price ?? 2499).toLocaleString("en-IN")})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

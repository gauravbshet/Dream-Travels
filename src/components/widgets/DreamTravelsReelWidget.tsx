"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Minus, Sparkles, ArrowRight, Play, Pause, X, MapPin, Star } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { reels as staticReels, type Reel } from "@/data/reels";
import { ReelBookingModal } from "@/components/modals/ReelBookingModal";

type ViewState = "expanded" | "pill" | "circle";

export function DreamTravelsReelWidget() {
  const pathname = usePathname();

  // Route check: Only render widget on Home ('/'), Destinations ('/destinations'), Destination Details ('/destinations/[slug]'), and About ('/about')
  const isAllowedRoute = Boolean(
    pathname === "/" ||
    pathname === "/destinations" ||
    pathname?.startsWith("/destinations/") ||
    pathname === "/about"
  );

  const [reelsList, setReelsList] = useState<Reel[]>(staticReels);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [userOverrideState, setUserOverrideState] = useState<ViewState | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isExpandedModal, setIsExpandedModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    if (!isAllowedRoute) return;

    async function fetchFeaturedReels() {
      try {
        const { data, error } = await supabase
          .from("reels")
          .select(`
            id,
            title,
            destination,
            description,
            video_url,
            thumbnail_url,
            instagram_url,
            category,
            is_active,
            is_featured_widget,
            package_id,
            packages (
              id,
              slug,
              title,
              location,
              price,
              original_price,
              image,
              duration,
              rating
            )
          `)
          .eq("is_active", true)
          .order("is_featured_widget", { ascending: false })
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: Reel[] = data.map((row) => {
            const linkedPkgData = Array.isArray(row.packages) ? row.packages[0] : row.packages;
            const linkedPackage = linkedPkgData
              ? {
                  id: linkedPkgData.id,
                  slug: linkedPkgData.slug,
                  title: linkedPkgData.title,
                  price: linkedPkgData.price,
                  originalPrice: linkedPkgData.original_price,
                  image: linkedPkgData.image,
                  duration: linkedPkgData.duration,
                  location: linkedPkgData.location,
                  rating: linkedPkgData.rating,
                }
              : null;

            return {
              id: row.id,
              title: row.title,
              destination: row.destination || linkedPkgData?.location || null,
              description: row.description,
              videoUrl: row.video_url,
              thumbnailUrl: row.thumbnail_url,
              instagramUrl: row.instagram_url,
              category: row.category,
              packageId: row.package_id,
              linkedPackage: linkedPackage,
              isFeaturedWidget: Boolean(row.is_featured_widget),
            };
          });

          setReelsList(mapped);
          setSelectedIndex(0);
        }
      } catch {
        // Fallback to staticReels
      }
    }

    fetchFeaturedReels();
  }, [supabase, isAllowedRoute]);

  // Active reel & package details
  const reel = reelsList[selectedIndex] || reelsList[0] || staticReels[0];
  const pkg = reel.linkedPackage;

  // Active package details
  const activeTitle = pkg?.title || reel.title;
  const activeDestination = pkg?.location || reel.destination || "Maharashtra";
  const activePrice = pkg?.price ?? reel.price ?? 2499;
  const activeRating = pkg?.rating ?? reel.rating ?? 4.8;
  const activeDuration = pkg?.duration ?? reel.duration ?? "2D / 1N";

  // Scroll listener to drive progressive 3-stage widget sizing:
  // 1. scrollY < 120px  => "expanded" (full dual pane)
  // 2. 120px <= scrollY < 450px => "pill" (compact capsule pill)
  // 3. scrollY >= 450px => "circle" (small round circle button)
  useEffect(() => {
    if (!isAllowedRoute) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      if (currentY < 20) {
        setUserOverrideState(null);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAllowedRoute]);

  // Active view state determination
  const currentState: ViewState = userOverrideState ?? (
    scrollY >= 450 ? "circle" : scrollY >= 120 ? "pill" : "expanded"
  );

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

  if (!isAllowedRoute) {
    return null;
  }

  return (
    <>
      {/* Mobile view */}
      <div className="fixed bottom-4 right-4 z-[180] font-sans sm:hidden">
        {currentState === "circle" ? (
          /* Mobile Stage 3: Small Round Circle */
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpandedModal(true)}
            aria-label={`Open featured trip: ${activeTitle}`}
            className="group relative flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-surface shadow-2xl backdrop-blur-md"
          >
            {reel.thumbnailUrl ? (
              <img src={reel.thumbnailUrl} alt={activeTitle} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-canopy text-xs font-bold text-white">
                🏕
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
              <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
            </div>
            <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white" />
            </span>
          </motion.button>
        ) : (
          /* Mobile Stage 1 & 2: Pill Capsule Badge */
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpandedModal(true)}
            className="group flex items-center gap-3 rounded-full border border-border bg-surface/95 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all duration-300"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/40 shadow-xs shrink-0">
              {reel.thumbnailUrl ? (
                <img src={reel.thumbnailUrl} alt={activeTitle} className="h-full w-full object-cover" />
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
                {activeTitle} • ₹{activePrice.toLocaleString("en-IN")}
              </p>
            </div>
          </motion.button>
        )}
      </div>

      {/* Desktop / Tablet view */}
      <div className="fixed bottom-4 right-4 z-[180] hidden font-sans sm:bottom-6 sm:right-6 sm:block">
        <AnimatePresence mode="wait">
          {currentState === "circle" ? (
            /* Desktop Stage 3: Small Round Circle Floating Button (Deep Scroll) */
            <motion.button
              key="minimized-circle-widget"
              initial={{ scale: 0.7, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 16 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setUserOverrideState("expanded");
              }}
              aria-label={`Open featured trip: ${activeTitle}`}
              title={`Featured Trip: ${activeTitle} (₹${activePrice.toLocaleString("en-IN")})`}
              className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-surface shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-canopy hover:shadow-canopy/25 cursor-pointer"
            >
              {reel.thumbnailUrl ? (
                <img
                  src={reel.thumbnailUrl}
                  alt={activeTitle}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-canopy text-sm font-bold text-white">
                  🏕
                </div>
              )}

              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-xs group-hover:scale-110 group-hover:bg-canopy transition-all">
                  <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
                </div>
              </div>

              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
            </motion.button>
          ) : currentState === "pill" ? (
            /* Desktop Stage 2: Pill Capsule Badge Button (Medium Scroll) */
            <motion.button
              key="minimized-pill-widget"
              initial={{ scale: 0.85, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 16 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setUserOverrideState("expanded");
              }}
              className="group flex items-center gap-3 rounded-full border border-border bg-surface/95 backdrop-blur-md px-4 py-2.5 shadow-2xl transition-all duration-300 hover:border-canopy/60 cursor-pointer"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/40 shadow-xs shrink-0">
                {reel.thumbnailUrl ? (
                  <img src={reel.thumbnailUrl} alt={activeTitle} className="h-full w-full object-cover" />
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
                  {activeTitle} • ₹{activePrice.toLocaleString("en-IN")}
                </p>
              </div>
            </motion.button>
          ) : (
            /* Desktop Stage 1: Full Dual-Pane Floating Reel & Package Card (Top of Page) */
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
                className="group relative h-[160px] w-[120px] sm:h-[185px] sm:w-[138px] shrink-0 overflow-hidden rounded-[20px] border border-white/20 bg-black shadow-2xl cursor-pointer"
              >
                <video
                  ref={videoRef}
                  key={reel.videoUrl || reel.id}
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl ?? undefined}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

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

                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <div className="inline-block rounded-md bg-black/75 backdrop-blur-xs px-2 py-1 text-[10px] font-medium leading-tight text-white shadow-xs">
                    <span className="line-clamp-2">
                      {reel.description || activeTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Pane: Featured Package Details Card */}
              <div className="relative flex h-[160px] w-[200px] sm:h-[185px] sm:w-[220px] flex-col justify-between rounded-[20px] border border-border/80 bg-surface/95 p-3 shadow-2xl backdrop-blur-md text-ink">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-canopy uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 fill-canopy/20" />
                    <span>Featured Trip</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserOverrideState("circle");
                    }}
                    title="Minimize widget"
                    aria-label="Minimize widget"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-100 text-ink/60 hover:bg-sage-200 hover:text-ink transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                </div>

                <div className="my-auto space-y-0.5 py-0.5">
                  <div className="flex items-center gap-1 text-[10.5px] font-semibold text-ink-muted">
                    <MapPin className="h-3 w-3 shrink-0 text-canopy" />
                    <span className="truncate">{activeDestination}</span>
                  </div>

                  <h4 className="text-xs font-extrabold text-ink tracking-tight line-clamp-2 leading-snug">
                    {activeTitle}
                  </h4>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="font-extrabold text-ink text-xs">
                      ₹{activePrice.toLocaleString("en-IN")}
                      <span className="text-[9.5px] font-normal text-ink-muted ml-0.5">/ person</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                      <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                      {activeRating}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="group flex w-full items-center justify-between rounded-full bg-canopy hover:bg-canopy-hover px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-300 active:scale-95"
                >
                  <span>Book Package</span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
        reelTitle={activeTitle}
        destination={activeDestination}
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
                key={reel.videoUrl || reel.id}
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
                      {activeDestination}
                    </span>
                    <span className="text-xs font-extrabold text-amber-400">
                      ★ {activeRating}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug">
                    {activeTitle}
                  </h3>
                  {reel.description && (
                    <p className="mt-1 text-xs text-white/80 line-clamp-3">
                      {reel.description}
                    </p>
                  )}
                  <p className="mt-2 text-lg font-extrabold text-white">
                    ₹{activePrice.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-white/70">/ person • {activeDuration}</span>
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
                  Book This Experience (₹{activePrice.toLocaleString("en-IN")})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

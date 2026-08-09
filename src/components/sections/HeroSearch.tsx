"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CalendarDays, Users, Sparkles, Search, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { cn } from "@/lib/utils";

const popularDestinations = [
  "Munnar",
  "Goa",
  "Coorg",
  "Wayanad",
  "Ooty",
  "Manali",
  "Andaman",
  "Lakshadweep",
  "Kashmir",
  "Kerala",
  "Spiti",
  "Bali",
  "Thailand",
  "Dubai",
];

const stayTypes = [
  "All Types",
  "Solo",
  "Group",
  "Family",
  "International",
];

const guestOptions = [
  "1 Guest",
  "2 Guests",
  "3-4 Guests",
  "5+ Group",
];

export function HeroSearchCompact({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/packages?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/packages");
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "flex items-center gap-2 rounded-[14px] border border-[rgba(76,159,34,0.14)] bg-white/95 p-2 shadow-[0_24px_56px_-32px_rgba(44,88,28,0.16)] backdrop-blur-xl",
        className
      )}
    >
      <div className="flex min-h-[48px] flex-1 items-center gap-2.5 rounded-[12px] border border-[rgba(76,159,34,0.1)] bg-surface px-3 text-left">
        <MapPin className="h-[18px] w-[18px] shrink-0 text-canopy-deep" />
        <div className="flex-1 min-w-0">
          <label htmlFor="hero-search-compact-input" className="block text-[10px] font-semibold text-ink-muted leading-tight">
            Destination
          </label>
          <input
            id="hero-search-compact-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Goa, Munnar, Bali..."
            className="w-full bg-transparent text-[14px] font-medium text-ink outline-none placeholder:text-ink-muted/60"
          />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1 text-ink-muted hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <button
        type="submit"
        aria-label="Search trips"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-canopy text-white shadow-sm transition-transform duration-[180ms] active:scale-95 hover:bg-canopy-hover"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
}

export function HeroSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [stayType, setStayType] = useState("All Types");

  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDestinations = destination
    ? popularDestinations.filter((d) => d.toLowerCase().includes(destination.toLowerCase()))
    : popularDestinations;

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("q", destination.trim());
    if (stayType && stayType !== "All Types") params.set("category", stayType);
    if (guests) params.set("guests", guests);
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);

    const queryString = params.toString();
    router.push(queryString ? `/packages?${queryString}` : "/packages");
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className={cn(
          "spotlight rounded-[18px] border border-[rgba(76,159,34,0.14)] bg-[rgba(255,255,255,0.96)] p-3 shadow-[0_32px_80px_-42px_rgba(41,77,37,0.18)] backdrop-blur-xl",
          "flex flex-col gap-2.5 xl:flex-row xl:items-center",
          className
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-1 xl:items-center gap-2 flex-1 min-w-0">
          
          {/* Destination Field with Autocomplete */}
          <div ref={dropdownRef} className="relative group z-[10] flex-1 min-w-0">
            <div
              onClick={() => setShowDestDropdown(true)}
              className="flex items-center gap-2.5 rounded-[14px] border border-[rgba(76,159,34,0.1)] bg-surface px-3.5 py-2.5 text-left transition duration-[180ms] hover:border-canopy/30 hover:bg-surface-2 cursor-text"
            >
              <MapPin className="h-4 w-4 shrink-0 text-canopy-deep" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-ink-muted">
                  Destination
                </span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                  placeholder="Where to? (e.g. Munnar)"
                  className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none placeholder:text-ink-muted/60 truncate"
                />
              </div>
              {destination && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDestination("");
                  }}
                  className="p-1 text-ink-muted hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDestDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 z-[50] max-h-56 overflow-y-auto rounded-[14px] border border-border bg-white p-2 shadow-2xl no-scrollbar">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Popular Places
                </p>
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => {
                        setDestination(dest);
                        setShowDestDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-xs font-semibold text-ink hover:bg-sage-100/70 hover:text-canopy transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 text-canopy" />
                      <span>{dest}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-ink-muted">No matching places found</p>
                )}
              </div>
            )}
          </div>

          {/* Check in Date */}
          <div className="relative group z-[3] flex-1 min-w-0">
            <div className="flex items-center gap-2.5 rounded-[14px] border border-[rgba(76,159,34,0.1)] bg-surface px-3.5 py-2.5 text-left transition duration-[180ms] hover:border-canopy/30 hover:bg-surface-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-canopy-deep" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-ink-muted">
                  Check in
                </span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Check out Date */}
          <div className="relative group z-[3] flex-1 min-w-0">
            <div className="flex items-center gap-2.5 rounded-[14px] border border-[rgba(76,159,34,0.1)] bg-surface px-3.5 py-2.5 text-left transition duration-[180ms] hover:border-canopy/30 hover:bg-surface-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-canopy-deep" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-ink-muted">
                  Check out
                </span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="relative group z-[3] flex-1 min-w-0">
            <div className="flex items-center gap-2.5 rounded-[14px] border border-[rgba(76,159,34,0.1)] bg-surface px-3.5 py-2.5 text-left transition duration-[180ms] hover:border-canopy/30 hover:bg-surface-2">
              <Users className="h-4 w-4 shrink-0 text-canopy-deep" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-ink-muted">
                  Guests
                </span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none cursor-pointer"
                >
                  <option value="">Any Guests</option>
                  {guestOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Type Stays */}
          <div className="relative group z-[3] flex-1 min-w-0">
            <div className="flex items-center gap-2.5 rounded-[14px] border border-[rgba(76,159,34,0.1)] bg-surface px-3.5 py-2.5 text-left transition duration-[180ms] hover:border-canopy/30 hover:bg-surface-2">
              <Sparkles className="h-4 w-4 shrink-0 text-canopy-deep" />
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold text-ink-muted">
                  Type Stays
                </span>
                <select
                  value={stayType}
                  onChange={(e) => setStayType(e.target.value)}
                  className="w-full bg-transparent text-[13.5px] font-medium text-ink outline-none cursor-pointer"
                >
                  {stayTypes.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

        <MagneticButton
          type="submit"
          className="relative z-[3] w-full shrink-0 justify-center rounded-[14px] bg-canopy px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-[180ms] hover:bg-canopy-hover xl:ml-2 xl:w-auto"
        >
          <Search className="h-4 w-4" />
          Search
        </MagneticButton>
      </div>
    </form>
  );
}

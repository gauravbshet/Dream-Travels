"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [scrolled, setScrolled] = useState(false);

  const [supabase] = useState(() => createBrowserSupabaseClient());

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled((prev) => {
            if (!prev && y > 100) return true;
            if (prev && y < 40) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    async function loadSession() {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;
      setSession(user);

      if (user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!mounted) return;
        setUserRole(profile?.role ?? null);
      }
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async () => {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        setSession(currentUser ?? null);

        if (!supabase) return;

        if (currentUser?.id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .single();
          setUserRole(profile?.role ?? null);
        } else {
          setUserRole(null);
        }
      }
    );

    return () => {
      mounted = false;
      if (authListener && typeof authListener.subscription?.unsubscribe === "function") {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setUserRole(null);
  }

  const isHomePage = pathname === "/";
  const isScrolledOrInnerPage = scrolled || !isHomePage;

  return (
    <>
      {/* Outer Shell: persistently fixed, 100% width, stable coordinates */}
      <header className="fixed inset-x-0 top-0 z-[200] w-full pointer-events-none">
        {/* Full-width top gradient fade: subtle backdrop on Home Page Hero only */}
        {isHomePage && (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent transition-opacity duration-500",
              scrolled ? "opacity-0" : "opacity-100"
            )}
          />
        )}

        {/* Inner Morphing Container: single persistent element smoothly contracting into floating pill */}
        <div
          data-tone={isScrolledOrInnerPage ? "light" : "dark"}
          className={cn(
            "pointer-events-auto relative mx-auto flex items-center justify-between gap-4 lg:gap-8",
            "transition-[width,max-width,height,margin-top,border-radius,background-color,border-color,box-shadow,padding] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isScrolledOrInnerPage
              ? "w-full h-[72px] px-4 sm:px-6 lg:mt-3 lg:h-[60px] lg:w-[calc(100%-2.5rem)] lg:max-w-[960px] xl:max-w-[1040px] lg:rounded-full lg:border lg:border-[rgba(32,34,31,0.08)] lg:bg-[rgba(250,250,247,0.94)] lg:shadow-[0_8px_30px_rgba(20,40,25,0.08)] lg:backdrop-blur-md lg:px-6 text-ink lg:text-[#20221F] bg-surface/95 border-b border-border/80"
              : "w-full max-w-7xl h-[72px] lg:h-[80px] mt-0 rounded-none border-transparent bg-transparent shadow-none px-4 sm:px-6 lg:px-8 text-white"
          )}
        >
          <Link href="/" className="flex min-h-11 items-center gap-2.5 shrink-0">
            <motion.img
              src="/logo.png"
              alt="Dream Travels Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-full bg-white/20 p-0.5 shadow-xs cursor-pointer"
              animate={{ y: [0, -3, 0] }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
            />
            <span
              className={cn(
                "font-bold text-[18px] tracking-tight hidden xs:inline transition-colors duration-300",
                isScrolledOrInnerPage ? "text-ink lg:text-[#20221F]" : "text-white drop-shadow-sm"
              )}
            >
              Dream Travels
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-[14.5px] font-medium transition-colors duration-300 rounded-full",
                    active
                      ? isScrolledOrInnerPage
                        ? "text-[#3F8C02] font-bold"
                        : "text-white font-bold"
                      : isScrolledOrInnerPage
                        ? "text-[#20221F]/80 hover:text-[#3F8C02] hover:bg-[#3F8C02]/5"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-[#3F8C02]" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4 pr-1 md:gap-6 md:pr-2">
            <IconButton label="Search" className={isScrolledOrInnerPage ? "text-[#20221F] hover:bg-[#20221F]/5" : "text-white hover:bg-white/10"}>
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isScrolledOrInnerPage
                      ? "text-[#20221F]/80 hover:bg-[#20221F]/5"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard#wishlist"
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isScrolledOrInnerPage
                      ? "text-[#20221F]/80 hover:bg-[#20221F]/5"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Wishlist
                </Link>
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center whitespace-nowrap rounded-full bg-[#3F8C02] px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors duration-300 hover:bg-[#347402]"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isScrolledOrInnerPage
                      ? "text-[#20221F]/80 hover:bg-[#20221F]/5"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                    isScrolledOrInnerPage
                      ? "text-[#20221F]/80 hover:bg-[#20221F]/5"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-[#3F8C02] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#347402] shadow-xs"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-2 justify-end">
            <button
              aria-label="Search destinations"
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300 border shadow-xs",
                isScrolledOrInnerPage
                  ? "border-border/60 bg-white/95 text-ink"
                  : "border-white/20 bg-black/30 text-white backdrop-blur-md"
              )}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border transition-colors duration-300",
                isScrolledOrInnerPage
                  ? "border-border text-ink"
                  : "border-white/20 text-white bg-black/30 backdrop-blur-md"
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              data-tone="light"
              className="absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col border-l border-border bg-white p-6 text-ink shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-canopy text-white font-semibold text-sm shadow-xs">
                    D
                  </span>
                  <span className="font-bold text-lg text-ink">Menu</span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-sage-100 text-ink hover:bg-sage-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "px-4 py-3 rounded-[12px] text-base font-semibold transition-colors",
                        active
                          ? "bg-canopy/10 text-canopy border border-canopy/20"
                          : "text-ink/80 hover:bg-sage-100 hover:text-ink"
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-auto pt-6 border-t border-border flex flex-col gap-3">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-[12px] bg-canopy hover:bg-canopy-hover px-4 py-3 text-center text-sm font-semibold text-white shadow-xs transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard#wishlist"
                      className="rounded-[12px] border border-border bg-white hover:bg-sage-100 px-4 py-3 text-center text-sm font-semibold text-ink transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="rounded-[12px] bg-canopy hover:bg-canopy-hover px-4 py-3 text-center text-sm font-semibold text-white transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleSignOut();
                      }}
                      className="rounded-[12px] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-3 text-center text-sm font-semibold text-rose-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-[12px] border border-border bg-white hover:bg-sage-100 px-4 py-3 text-center text-sm font-semibold text-ink transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-[12px] bg-canopy hover:bg-canopy-hover px-4 py-3 text-center text-sm font-semibold text-white shadow-xs transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-[10px] text-ink/70 hover:bg-sage-100 hover:text-ink transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

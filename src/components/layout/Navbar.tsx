"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Bell, User, Menu, X, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserSupabaseClient> | null>(null);

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(session);

      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!mounted) return;
        setUserRole(profile?.role ?? null);
      }

      setAuthReady(true);
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);

        if (!supabase) return;

        if (newSession?.user?.id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", newSession.user.id)
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

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-soft py-2 lg:py-3"
            : "bg-gradient-to-b from-black/40 to-transparent py-3 lg:py-5 lg:bg-none"
        )}
      >
        <Container className="flex items-center justify-between gap-3 lg:gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg transition-transform",
                "group-hover:scale-105"
              )}
            >
              D
            </span>
            <span
              className={cn(
                "font-bold text-lg tracking-tight transition-colors hidden xs:inline",
                scrolled || menuOpen ? "text-ink" : "text-white lg:text-white"
              )}
            >
              Dream Travels
            </span>
          </Link>

          {/* Desktop search + links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                  scrolled
                    ? "text-ink/70 hover:text-ink hover:bg-ink/5"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <IconButton scrolled={scrolled} label="Search">
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    scrolled
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard#wishlist"
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    scrolled
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  Wishlist
                </Link>
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      scrolled
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "bg-white/20 text-white hover:bg-white/30"
                    )}
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    scrolled
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "bg-white/20 text-white hover:bg-white/30"
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
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    scrolled
                      ? "bg-ink/5 text-ink hover:bg-ink/10"
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    "rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark"
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: search pill + hamburger */}
          <div className="flex lg:hidden items-center gap-2 flex-1 justify-end">
            <button
              className={cn(
                "flex flex-1 max-w-[220px] xs:max-w-[260px] items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors",
                scrolled ? "bg-ink/[0.06] text-ink/60" : "bg-white/20 text-white backdrop-blur-md"
              )}
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">Search your destination</span>
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                scrolled ? "bg-ink/[0.06] text-ink" : "bg-white/20 text-white backdrop-blur-md"
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white shadow-2xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-lg">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-3 rounded-xl text-base font-medium text-ink/80 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-3">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard#wishlist"
                      className="rounded-2xl bg-surface px-4 py-3 text-center text-sm font-semibold text-ink"
                      onClick={() => setMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="rounded-2xl bg-surface px-4 py-3 text-center text-sm font-semibold text-ink"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-2xl bg-ink/5 px-4 py-3 text-center text-sm font-semibold text-ink"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-2xl bg-surface px-4 py-3 text-center text-sm font-semibold text-ink"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
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
  scrolled,
  label,
}: {
  children: React.ReactNode;
  scrolled: boolean;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        scrolled
          ? "text-ink/70 hover:bg-ink/5 hover:text-ink"
          : "text-white/90 hover:bg-white/10 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

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
    function onScroll() {
      setScrolled(window.scrollY > 24);
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

  return (
    <>
      <header
        data-tone={scrolled ? "light" : "dark"}
        className={cn(
          "fixed inset-x-0 top-0 z-[200] transition-all duration-300 ease-in-out",
          scrolled
            ? "border-b border-border/80 bg-surface/95 backdrop-blur-xl shadow-xs text-ink"
            : "bg-gradient-to-b from-black/70 via-black/30 to-transparent border-transparent text-white"
        )}
      >
        <Container className="flex h-[72px] lg:h-[80px] items-center justify-between gap-4 lg:gap-8">
          <Link href="/" className="flex min-h-11 items-center gap-2.5 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-canopy text-white font-semibold text-base shadow-sm">
              D
            </span>
            <span
              className={cn(
                "font-semibold text-[17px] tracking-[-0.01em] hidden xs:inline transition-colors",
                scrolled ? "text-ink" : "text-white"
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
                    "relative px-3.5 py-2 text-[14.5px] font-medium transition-colors",
                    active
                      ? scrolled
                        ? "text-primary"
                        : "text-white font-bold"
                      : scrolled
                      ? "text-ink-muted hover:text-ink"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-canopy" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <IconButton label="Search" className={scrolled ? "" : "text-white hover:bg-white/10"}>
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-[10px] px-4 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-ink/80 hover:bg-sage-100"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard#wishlist"
                  className={cn(
                    "rounded-[10px] px-4 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-ink/80 hover:bg-sage-100"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Wishlist
                </Link>
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-[10px] px-4 py-2 text-sm font-medium bg-canopy text-white hover:bg-canopy-hover transition-colors shadow-xs"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    "rounded-[10px] px-4 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-ink/80 hover:bg-sage-100"
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
                    "rounded-[10px] px-4 py-2 text-sm font-medium transition-colors",
                    scrolled
                      ? "text-ink/80 hover:bg-sage-100"
                      : "text-white/90 hover:bg-white/15"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-[10px] bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-canopy-hover shadow-xs"
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
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors border shadow-xs",
                scrolled
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
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border transition-colors",
                scrolled
                  ? "border-border text-ink"
                  : "border-white/20 text-white bg-black/30 backdrop-blur-md"
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
            className="fixed inset-0 z-[300] bg-[oklch(0.1_0.016_158/0.72)] backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              data-tone="dark"
              className="absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col border-l border-border bg-bg-deep p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-lg">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-sage-100 text-ink"
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
                    className="px-3 py-3 rounded-[10px] text-base font-medium text-ink/80 hover:bg-sage-100 hover:text-primary transition-colors"
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
                      className="rounded-[12px] bg-canopy px-4 py-3 text-center text-sm font-semibold text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard#wishlist"
                      className="rounded-[12px] border border-border px-4 py-3 text-center text-sm font-semibold text-ink"
                      onClick={() => setMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="rounded-[12px] border border-border px-4 py-3 text-center text-sm font-semibold text-ink"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-[12px] bg-sage-100 px-4 py-3 text-center text-sm font-semibold text-ink"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-[12px] border border-border px-4 py-3 text-center text-sm font-semibold text-ink"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-[12px] bg-canopy px-4 py-3 text-center text-sm font-semibold text-white"
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

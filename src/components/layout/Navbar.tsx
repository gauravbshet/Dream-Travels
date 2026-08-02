"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserSupabaseClient> | null>(null);

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
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

      setAuthReady(true);
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
      <header className="sticky inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#ECEDE9]">
        <Container className="flex h-[76px] lg:h-[84px] items-center justify-between gap-4 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-white font-semibold text-base">
              D
            </span>
            <span className="font-semibold text-[17px] tracking-[-0.01em] text-ink hidden xs:inline">
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
                    active ? "text-primary" : "text-text-secondary hover:text-ink"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-primary" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <IconButton label="Search">
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-[10px] px-4 py-2 text-sm font-medium text-ink/80 hover:bg-sage-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard#wishlist"
                  className="rounded-[10px] px-4 py-2 text-sm font-medium text-ink/80 hover:bg-sage-100 transition-colors"
                >
                  Wishlist
                </Link>
                {userRole === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-[10px] px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-[10px] px-4 py-2 text-sm font-medium text-ink/80 hover:bg-sage-100 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-[10px] px-4 py-2 text-sm font-medium text-ink/80 hover:bg-sage-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: search pill + hamburger */}
          <div className="flex lg:hidden items-center gap-2 flex-1 justify-end">
            <button className="flex flex-1 max-w-[220px] xs:max-w-[260px] items-center gap-2 rounded-[10px] border border-border px-4 py-2.5 text-sm text-text-secondary transition-colors">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">Search your destination</span>
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-border text-ink transition-colors"
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
                      className="rounded-[12px] bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
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
                      className="rounded-[12px] bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
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
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-[10px] text-ink/70 hover:bg-sage-100 hover:text-ink transition-colors"
    >
      {children}
    </button>
  );
}

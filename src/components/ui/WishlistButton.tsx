"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

interface WishlistButtonProps {
  /** The UUID of the package row in Supabase. When omitted the button is cosmetic only. */
  packageId?: string;
  className?: string;
}

export function WishlistButton({ packageId, className }: WishlistButtonProps) {
  const router = useRouter();

  // Single shared Supabase client instance — NEVER re-create it,
  // so the auth session established by onAuthStateChange is available
  // in handleToggle without a fresh (unauthenticated) client.
  const supabase = useRef(createBrowserSupabaseClient()).current;

  const [active, setActive] = useState(false);
  const [wishlistRowId, setWishlistRowId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!packageId) return;

    let isMounted = true;

    // onAuthStateChange fires immediately with the current session (INITIAL_SESSION),
    // then again on login/logout/token-refresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      const uid = session?.user?.id ?? null;
      setUserId(uid);

      if (!uid) {
        setActive(false);
        setWishlistRowId(null);
        return;
      }

      // Check if package is already wishlisted
      const { data, error } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", uid)
        .eq("package_id", packageId)
        .maybeSingle();

      if (error) {
        console.error("[WishlistButton] select error:", error.message);
        return;
      }

      if (isMounted && data) {
        setActive(true);
        setWishlistRowId((data as { id: string }).id);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  // supabase ref is stable; packageId drives the effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

  const handleToggle = () => {
    if (!packageId) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      if (active && wishlistRowId) {
        // Remove
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("id", wishlistRowId)
          .eq("user_id", userId);

        if (error) {
          console.error("[WishlistButton] delete error:", error.message);
          return;
        }
        setActive(false);
        setWishlistRowId(null);
      } else {
        // Add
        const { data, error } = await supabase
          .from("wishlists")
          .insert({ user_id: userId, package_id: packageId })
          .select("id")
          .single();

        if (error) {
          console.error("[WishlistButton] insert error:", error.message, error.hint, error.details);
          return;
        }

        if (data) {
          setActive(true);
          setWishlistRowId((data as { id: string }).id);
        }
      }
    });
  };

  return (
    <motion.span
      role="button"
      tabIndex={0}
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          handleToggle();
        }
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      data-tone="dark"
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[oklch(0.16_0.022_158/0.7)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95 cursor-pointer select-none",
        isPending && "opacity-60 pointer-events-none",
        className
      )}
    >
      <motion.span
        animate={active ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Heart
          className={cn(
            "h-4.5 w-4.5 transition-colors",
            active ? "fill-canopy text-canopy" : "text-ink-2"
          )}
        />
      </motion.span>
    </motion.span>
  );
}

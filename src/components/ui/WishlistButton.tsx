"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/components/providers/WishlistProvider";

interface WishlistButtonProps {
  /** The UUID of the package row in Supabase. When omitted the button is cosmetic only. */
  packageId?: string;
  className?: string;
}

export function WishlistButton({ packageId, className }: WishlistButtonProps) {
  const router = useRouter();

  // Wishlist state lives in WishlistProvider (mounted once in the root
  // layout) rather than being fetched per-button — see that file for why.
  const { userId, isWishlisted, toggle } = useWishlist();
  const [isPending, startTransition] = useTransition();

  const active = packageId ? isWishlisted(packageId) : false;

  const handleToggle = () => {
    if (!packageId) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      await toggle(packageId);
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

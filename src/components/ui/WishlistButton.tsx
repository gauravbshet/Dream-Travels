"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WishlistButton({ className }: { className?: string }) {
  const [active, setActive] = useState(false);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive((v) => !v);
      }}
      aria-label="Toggle wishlist"
      aria-pressed={active}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur transition-transform hover:scale-105 active:scale-95",
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
            active ? "fill-primary text-primary" : "text-ink/60"
          )}
        />
      </motion.span>
    </motion.button>
  );
}

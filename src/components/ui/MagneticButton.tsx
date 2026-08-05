"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

export function MagneticButton({
  children,
  className,
  onClick,
  variant = "primary",
  ...props
}: NativeButtonProps & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setPos({ x, y });
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.5 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-colors overflow-hidden",
        variant === "primary" && "bg-canopy text-white hover:bg-canopy-hover",
        variant === "secondary" &&
          "bg-surface text-ink border border-border hover:border-border-lit",
        variant === "ghost" &&
          "bg-transparent text-ink border border-border hover:border-border-lit",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

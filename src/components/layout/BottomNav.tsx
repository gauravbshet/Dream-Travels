"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, MessageCircle, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "support", label: "Support", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
  { id: "more", label: "More", icon: Menu },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("explore");

  // On package detail pages (/packages/[slug]), hide global BottomNav so PackageMobileBar has clean priority at bottom-0
  if (pathname?.startsWith("/packages/") && pathname.split("/").filter(Boolean).length >= 2) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div data-tone="dark" className="mx-auto flex max-w-md items-center justify-between rounded-[14px] bg-[oklch(0.19_0.024_158/0.88)] px-2 py-2 backdrop-blur-xl border border-border">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-[12px] py-2 text-[11px] font-medium"
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-[12px] bg-surface-2"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 relative z-10 transition-colors",
                  isActive ? "text-canopy" : "text-ink-muted"
                )}
              />
              <span
                className={cn(
                  "relative z-10 transition-colors",
                  isActive ? "text-canopy" : "text-ink-muted"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

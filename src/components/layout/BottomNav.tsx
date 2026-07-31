"use client";

import { useState } from "react";
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
  const [active, setActive] = useState<string>("explore");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-[28px] bg-white/90 px-2 py-2 shadow-[0_10px_40px_rgba(26,26,26,0.14)] backdrop-blur-xl border border-white/60">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium"
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 relative z-10 transition-colors",
                  isActive ? "text-primary" : "text-ink/50"
                )}
              />
              <span
                className={cn(
                  "relative z-10 transition-colors",
                  isActive ? "text-primary" : "text-ink/50"
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

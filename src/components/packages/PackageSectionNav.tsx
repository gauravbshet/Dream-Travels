"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "highlights", label: "Highlights" },
  { id: "facts", label: "Trip Facts" },
  { id: "itinerary", label: "Itinerary" },
  { id: "inclusions", label: "Inclusions" },
  { id: "faq", label: "FAQs" },
  { id: "trust", label: "Why Choose Us" },
];

export function PackageSectionNav() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -50% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-[72px] lg:top-[80px] z-30 mb-6 border-b border-border/80 bg-surface/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-3 sm:px-4 py-2 no-scrollbar scroll-smooth">
        {SECTIONS.map(({ id, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200",
                isActive
                  ? "bg-canopy text-white shadow-xs scale-[1.02]"
                  : "text-ink-muted hover:bg-sage-100 hover:text-ink"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

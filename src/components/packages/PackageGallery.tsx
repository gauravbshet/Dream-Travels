"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = images.slice(0, 5);
  const remaining = images.length - visible.length;

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-ink">Trip Gallery</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {visible.map((src, i) => (
            <button
              type="button"
              key={src + i}
              onClick={() => setOpenIndex(i)}
              className={cn(
                "group relative overflow-hidden rounded-[14px] border border-border/70 bg-surface shadow-2xs transition-all duration-300 hover:shadow-md hover:border-canopy/40",
                i === 0 ? "col-span-2 row-span-2 aspect-[4/3] sm:aspect-auto" : "col-span-1 aspect-square"
              )}
            >
              <Image
                src={src}
                alt={`${title} photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
              {i === visible.length - 1 && remaining > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/60 font-bold text-white text-sm backdrop-blur-xs">
                  +{remaining} Photos
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          title={title}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}

function Lightbox({
  images,
  index,
  title,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  title: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const goPrev = () => onNavigate((index - 1 + images.length) % images.length);
  const goNext = () => onNavigate((index + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-2 sm:left-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="relative h-[70vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[index]}
          alt={`${title} photo ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-2 sm:right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <span className="absolute bottom-6 text-sm text-white/70">
        {index + 1} / {images.length}
      </span>
    </div>
  );
}

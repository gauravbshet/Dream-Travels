"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PackageGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = images.slice(0, 5);
  const remaining = images.length - visible.length;

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setOpenIndex(0)}
          className="group relative col-span-4 aspect-[16/9] overflow-hidden rounded-[20px] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
        >
          <Image
            src={visible[0]}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </button>
        {visible.slice(1).map((src, i) => (
          <button
            type="button"
            key={src + i}
            onClick={() => setOpenIndex(i + 1)}
            className="group relative col-span-2 aspect-square overflow-hidden rounded-[16px] sm:col-span-1"
          >
            <Image
              src={src}
              alt={`${title} photo ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {i === visible.length - 2 && remaining > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                +{remaining} more
              </span>
            )}
          </button>
        ))}
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

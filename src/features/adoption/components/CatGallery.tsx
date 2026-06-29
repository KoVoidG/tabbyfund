"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CatGalleryProps {
  photos: string[];
  name: string;
}

/**
 * CatGallery — photo gallery with navigation dots and arrows.
 */
export function CatGallery({ photos, name }: CatGalleryProps) {
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent((c) => (c + 1) % photos.length);
  }

  function prev() {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-[#F7F7FB]">
      <div className="relative h-80 sm:h-[28rem]">
        <img
          src={photos[current]}
          alt={`${name} photo ${current + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#2D3748] transition hover:bg-white"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#2D3748] transition hover:bg-white"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-5 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

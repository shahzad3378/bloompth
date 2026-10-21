"use client";

import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (images.length === 0) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded-3xl bg-white text-slate-400">
        <span className="font-semibold">No product image</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white p-6 sm:p-8">
        <img
          src={selectedImage}
          alt={`${title} image ${selectedIndex + 1}`}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/85 px-4 py-2 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:inline-flex">
          View product images
        </div>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto px-1 pb-1" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${selectedIndex === index ? "border-blue-600" : "border-slate-200 hover:border-slate-400"}`}
            >
              <img src={image} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

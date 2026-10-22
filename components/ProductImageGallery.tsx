"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
};

export default function ProductImageGallery({
  images,
  title,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selectedImage = images[selectedIndex];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") setSelectedIndex((index) => (index + 1) % images.length);
      if (event.key === "ArrowLeft") setSelectedIndex((index) => (index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded-3xl bg-white text-slate-400">
        <span className="font-semibold">No product image</span>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => setLightboxOpen(true)} aria-label="Open product image gallery" className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-white p-5 sm:p-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
        <img
          src={selectedImage}
          alt={`${title} image ${selectedIndex + 1}`}
          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </button>
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
      {lightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label={`${title} image gallery`} onClick={() => setLightboxOpen(false)} className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950/95 p-4 sm:p-8">
          <button type="button" autoFocus onClick={() => setLightboxOpen(false)} aria-label="Close image gallery" className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><X size={22} /></button>
          <div className="relative flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img src={selectedImage} alt={`${title} image ${selectedIndex + 1}`} className="max-h-full max-w-full object-contain" />
            {images.length > 1 && <>
              <button type="button" onClick={() => setSelectedIndex((index) => (index - 1 + images.length) % images.length)} aria-label="Previous product image" className="absolute left-0 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeft size={26} /></button>
              <button type="button" onClick={() => setSelectedIndex((index) => (index + 1) % images.length)} aria-label="Next product image" className="absolute right-0 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRight size={26} /></button>
            </>}
          </div>
          <p className="mt-4 text-sm font-semibold text-white">{selectedIndex + 1} / {images.length}</p>
          {images.length > 1 && <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-2" onClick={(event) => event.stopPropagation()}>{images.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setSelectedIndex(index)} aria-label={`Show product image ${index + 1}`} aria-pressed={selectedIndex === index} className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white p-1 ${selectedIndex === index ? "border-white" : "border-white/30"}`}><img src={image} alt="" className="h-full w-full object-contain" /></button>)}</div>}
        </div>
      )}
    </div>
  );
}

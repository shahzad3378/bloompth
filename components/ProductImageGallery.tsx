"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

type ProductGalleryProps = {
  images: string[];
  videoUrl?: string | null;
  title: string;
};

type GalleryItem = { type: "image" | "video"; src: string };

export default function ProductImageGallery({ images, videoUrl, title }: ProductGalleryProps) {
  const media = useMemo<GalleryItem[]>(() => [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
  ], [images, videoUrl]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selected = media[selectedIndex];

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") setSelectedIndex((index) => (index + 1) % media.length);
      if (event.key === "ArrowLeft") setSelectedIndex((index) => (index - 1 + media.length) % media.length);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, media.length]);

  if (!selected) {
    return <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded-3xl bg-white text-slate-400"><span className="font-semibold">No product image</span></div>;
  }

  const renderMedia = (item: GalleryItem, inLightbox = false) => item.type === "video" ? (
    <video key={item.src} src={item.src} autoPlay muted playsInline loop controls preload="metadata" aria-label={`${title} product video`} className={inLightbox ? "max-h-full max-w-full rounded-xl object-contain" : "h-full w-full object-contain"} />
  ) : (
    <img src={item.src} alt={`${title} product photo`} className={inLightbox ? "max-h-full max-w-full object-contain" : "h-full w-full object-contain"} />
  );

  return (
    <div>
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-white p-4 sm:p-8">
        {selected.type === "image" ? (
          <button type="button" onClick={() => setLightboxOpen(true)} aria-label="Open product photo" className="flex h-full w-full items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            {renderMedia(selected)}
          </button>
        ) : renderMedia(selected)}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex max-w-full gap-3 overflow-x-auto px-1 pb-1" aria-label="Product photos and video">
          {media.map((item, index) => (
            <button key={`${item.type}-${item.src}`} type="button" onClick={() => setSelectedIndex(index)} aria-label={item.type === "video" ? "Play product video" : `Show product photo ${index + 1}`} aria-pressed={selectedIndex === index} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 sm:h-20 sm:w-20 ${selectedIndex === index ? "border-blue-600" : "border-slate-200 hover:border-slate-400"}`}>
              {item.type === "video" ? <><video src={item.src} muted playsInline preload="metadata" className="h-full w-full object-cover" /><span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white"><Play size={20} fill="currentColor" /></span></> : <img src={item.src} alt="" className="h-full w-full object-contain" />}
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label={`${title} product gallery`} onClick={() => setLightboxOpen(false)} className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950/95 p-3 sm:p-8">
          <button type="button" autoFocus onClick={() => setLightboxOpen(false)} aria-label="Close product gallery" className="absolute right-3 top-3 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-4 sm:top-4"><X size={22} /></button>
          <div className="relative flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {renderMedia(selected, true)}
            {media.length > 1 && <>
              <button type="button" onClick={() => setSelectedIndex((index) => (index - 1 + media.length) % media.length)} aria-label="Previous product media" className="absolute left-0 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeft size={26} /></button>
              <button type="button" onClick={() => setSelectedIndex((index) => (index + 1) % media.length)} aria-label="Next product media" className="absolute right-0 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRight size={26} /></button>
            </>}
          </div>
          <p className="mt-3 text-sm font-semibold text-white">{selectedIndex + 1} / {media.length}</p>
        </div>
      )}
    </div>
  );
}

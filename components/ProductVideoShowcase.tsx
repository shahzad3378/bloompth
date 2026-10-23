"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Play, Volume2, X } from "lucide-react";

// Temporary sample clip to preview placement and behavior. Replace with BloomPath product clips.
const sampleVideo = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export default function ProductVideoShowcase() {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (visibleRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (dismissed) return null;

  return (
    <>
      <aside aria-label="BloomPath product video preview" className="fixed right-3 top-1/2 z-40 hidden w-44 -translate-y-1/2 overflow-hidden rounded-2xl border border-brand-900/15 bg-white shadow-[0_16px_50px_rgba(11,39,59,0.2)] sm:block">
        <div className="relative aspect-[9/14] bg-brand-950">
          <video ref={videoRef} src={sampleVideo} autoPlay muted loop playsInline preload="metadata" aria-label="Sample product video preview" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-brand-950/85 to-transparent p-2.5 text-white">
            <span className="text-[10px] font-black uppercase tracking-wider">Sample preview</span>
            <button type="button" onClick={() => setDismissed(true)} aria-label="Close video preview" className="rounded-full bg-black/30 p-1.5 hover:bg-black/60"><X size={14} /></button>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/95 via-brand-950/65 to-transparent p-3 pt-10 text-white">
            <p className="text-xs font-bold">BloomPath product videos</p>
            <Link href="/products" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-2 text-[11px] font-black text-brand-950 transition hover:brightness-95">
              Explore products <Play size={12} fill="currentColor" />
            </Link>
          </div>
          <span className="absolute bottom-3 right-3 rounded-full bg-black/45 p-1.5 text-white" aria-label="Muted preview"><Volume2 size={13} /></span>
        </div>
      </aside>

      <div className="fixed bottom-4 right-3 z-40 sm:hidden">
        {expanded ? <div className="w-52 overflow-hidden rounded-2xl border border-brand-900/15 bg-white shadow-xl">
          <div className="relative aspect-[9/12] bg-brand-950">
            <video src={sampleVideo} autoPlay muted loop playsInline preload="metadata" aria-label="Sample product video preview" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-brand-950/85 to-transparent p-2.5 text-white">
              <span className="text-[10px] font-black uppercase tracking-wider">Sample preview</span>
              <button type="button" onClick={() => setExpanded(false)} aria-label="Minimize video preview" className="rounded-full bg-black/30 p-1.5"><ChevronDown size={14} /></button>
            </div>
            <Link href="/products" className="absolute inset-x-2 bottom-2 rounded-lg bg-brand-500 px-3 py-2 text-center text-xs font-black text-brand-950">Explore products</Link>
          </div>
        </div> : <button type="button" onClick={() => setExpanded(true)} className="inline-flex items-center gap-2 rounded-full border border-brand-900/10 bg-brand-950 px-4 py-3 text-xs font-black text-white shadow-lg"><Play size={14} fill="currentColor" /> Watch product video</button>}
      </div>
    </>
  );
}

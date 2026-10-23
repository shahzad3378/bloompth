"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const productVideo = "/videos/hair-color-stick-preview.mp4";
const productUrl = "/products/long-lasting-gray-coverage-easy-to-use-at-home-or-on-the-go-portable-hair-color-stick-with-applicator-brush-for-touch-ups-between-salon-visits-ideal-for-brown-black-hair-contains-plant-based-squalane";
const productName = "Portable Hair Color Stick";

function VideoCard({ mobile = false }: { mobile?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (video.getBoundingClientRect().bottom > 0 && video.getBoundingClientRect().top < window.innerHeight && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <aside aria-label={`${productName} product video`} className={`overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-lg ${mobile ? "w-full" : "w-full"}`}>
      <video ref={videoRef} src={productVideo} muted loop playsInline controls preload="metadata" aria-label={`Video of ${productName}`} className="aspect-[9/12] w-full bg-brand-950 object-cover" />
      <div className="p-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-brand-500">Product video</p>
        <p className="mt-1 line-clamp-2 text-sm font-black text-ink">{productName}</p>
        <Link href={productUrl} className="mt-2 inline-flex text-xs font-black text-brand-900 underline decoration-brand-500 underline-offset-4 hover:text-brand-500">View this product</Link>
      </div>
    </aside>
  );
}

export default function ProductVideoShowcase() {
  return (
    <>
      <div className="hidden lg:block">
        <div className="sticky top-[calc(100vh-26rem)]">
          <VideoCard />
        </div>
      </div>
      <div className="mt-8 lg:hidden">
        <VideoCard mobile />
      </div>
    </>
  );
}

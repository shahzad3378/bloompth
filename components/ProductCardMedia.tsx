"use client";

import { useEffect, useRef, useState } from "react";

type ProductCardMediaProps = {
  image: string | null;
  videoUrl?: string | null;
  title: string;
};

export default function ProductCardMedia({ image, videoUrl, title }: ProductCardMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => { setImageFailed(false); }, [image]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || videoFailed) return;

    const observer = new IntersectionObserver(([entry]) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (entry.isIntersecting && !document.hidden && !reducedMotion) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.35 });

    observer.observe(video);
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && video.getBoundingClientRect().top < window.innerHeight && video.getBoundingClientRect().bottom > 0) {
        void video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
    };
  }, [videoFailed, videoUrl]);

  if (videoUrl && !videoFailed) {
    return (
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={`${title} product video`}
        onTimeUpdate={(event) => {
          if (event.currentTarget.currentTime >= 9) event.currentTarget.currentTime = 0;
        }}
        onError={() => setVideoFailed(true)}
        className="h-full w-full object-contain"
      />
    );
  }

  if (image && !imageFailed) {
    return <img src={image} alt={title} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-contain" />;
  }

  const brand = title.toLowerCase().startsWith("cerave") ? "CeraVe" : title.toLowerCase().startsWith("centrum") ? "Centrum" : "BloomPath";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-50 via-white to-blue-50 px-5 text-center" role="img" aria-label={`${title} product photo coming soon`}>
      <div className="rounded-xl border border-blue-100 bg-white px-5 py-3 text-xl font-black tracking-tight text-blue-800 shadow-sm">{brand}</div>
      <span className="line-clamp-3 max-w-[220px] text-sm font-semibold leading-snug text-slate-700">{title}</span>
      <span className="text-[11px] font-medium text-slate-400">Product photo coming soon</span>
    </div>
  );
}

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

  if (image) {
    return <img src={image} alt={title} loading="lazy" className="h-full w-full object-contain" />;
  }

  return <span className="text-xs font-semibold text-slate-400">No product media</span>;
}

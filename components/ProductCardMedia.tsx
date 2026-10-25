"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type ProductCardMediaProps = {
  image: string | null;
  videoUrl?: string | null;
  title: string;
};

export default function ProductCardMedia({ image, videoUrl, title }: ProductCardMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [playManually, setPlayManually] = useState(false);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    try {
      await video.play();
      setPlayManually(false);
    } catch {
      setPlayManually(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl || videoFailed) return;

    const observer = new IntersectionObserver(([entry]) => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (entry.isIntersecting && !document.hidden && !reducedMotion) {
        void playVideo();
      } else {
        video.pause();
      }
    }, { threshold: 0.35 });

    observer.observe(video);
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && video.getBoundingClientRect().top < window.innerHeight && video.getBoundingClientRect().bottom > 0) {
        void playVideo();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
    };
  }, [playVideo, videoFailed, videoUrl]);

  if (videoUrl && !videoFailed) {
    return (
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          loop
          preload="none"
          aria-label={`${title} product video`}
          onTimeUpdate={(event) => {
            if (event.currentTarget.currentTime >= 9) event.currentTarget.currentTime = 0;
          }}
          onPlay={() => setPlayManually(false)}
          onPause={() => setPlayManually(true)}
          onError={() => setVideoFailed(true)}
          className="h-full w-full object-contain"
        />
        {playManually && (
        <button
          type="button"
          aria-label={`Play ${title} video`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void playVideo();
          }}
          onKeyDown={(event) => event.stopPropagation()}
          className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/10"
        >
          <span className="grid size-12 place-items-center rounded-full bg-white/95 text-brand-900 shadow-lg ring-1 ring-black/10">
            <Play size={21} fill="currentColor" />
          </span>
        </button>
        )}
      </div>
    );
  }

  if (image) {
    return <img src={image} alt={title} loading="lazy" className="h-full w-full object-contain" />;
  }

  return <span className="text-xs font-semibold text-slate-400">No product media</span>;
}

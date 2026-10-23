"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type ShowcaseProductVideo = {
  id: number | string;
  title: string;
  slug: string;
  video_url: string;
  featured: boolean;
};

const ROTATE_EVERY_MS = 9_000;

export default function ProductVideoShowcase({
  products,
}: {
  products: ShowcaseProductVideo[];
}) {
  const clips = products.filter(
    (product) => product.featured && product.video_url?.trim(),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = clips.length ? clips[activeIndex % clips.length] : undefined;

  useEffect(() => {
    if (clips.length < 2) return;
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % clips.length),
      ROTATE_EVERY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, clips.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const canAnimate = () =>
      !document.hidden &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && canAnimate()) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      const bounds = video.getBoundingClientRect();
      if (
        bounds.bottom > 0 &&
        bounds.top < window.innerHeight &&
        canAnimate()
      ) {
        void video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active?.video_url]);

  if (!active) return null;

  return (
    <article
      aria-label={active.title + " featured product video"}
      className="w-full overflow-hidden rounded-xl border border-brand-900/10 bg-white shadow-lg"
    >
      <Link
        href={"/products/" + active.slug}
        aria-label={"Open featured product " + active.title}
        className="relative block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        <video
          key={active.video_url}
          ref={videoRef}
          src={active.video_url}
          muted
          playsInline
          loop={clips.length === 1}
          preload="metadata"
          onTimeUpdate={(event) => {
            if (clips.length === 1 && event.currentTarget.currentTime >= 9) {
              event.currentTarget.currentTime = 0;
            }
          }}
          aria-label={"Video of " + active.title}
          className="aspect-[9/12] w-full bg-brand-950 object-cover"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
          Featured product{clips.length > 1 ? ` · ${activeIndex + 1}/${clips.length}` : ""}
        </span>
      </Link>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-black text-ink">{active.title}</p>
        <Link
          href="/global-sourcing"
          className="mt-2 inline-flex text-xs font-black text-brand-900 underline decoration-brand-500 underline-offset-4 hover:text-brand-500"
        >
          Personal Sourcing
        </Link>
      </div>
    </article>
  );
}

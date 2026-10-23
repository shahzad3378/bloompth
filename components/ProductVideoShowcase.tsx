"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type ShowcaseProductVideo = {
  id: number | string;
  title: string;
  slug: string;
  video_url: string;
};

const ROTATE_EVERY_MS = 12_000;

export default function ProductVideoShowcase({
  products,
}: {
  products: ShowcaseProductVideo[];
}) {
  const clips = products.filter((product) => product.video_url?.trim());
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = clips[activeIndex];

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

    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry.isIntersecting &&
        !document.hidden &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
    observer.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (
        video.getBoundingClientRect().bottom > 0 &&
        video.getBoundingClientRect().top < window.innerHeight &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
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

  if (!active) {
    return (
      <aside className="mt-8 rounded-2xl border border-dashed border-brand-900/20 bg-white p-5 text-sm text-slate-600 lg:mt-0">
        Har product ki video uske admin edit page se upload karein.
      </aside>
    );
  }

  return (
    <aside
      aria-label={active.title + " product video"}
      className="mt-8 w-full overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-lg lg:mt-0"
    >
      <video
        key={active.video_url}
        ref={videoRef}
        src={active.video_url}
        muted
        playsInline
        controls
        preload="metadata"
        onEnded={() => clips.length > 1 && setActiveIndex((index) => (index + 1) % clips.length)}
        aria-label={"Video of " + active.title}
        className="aspect-[9/12] w-full bg-brand-950 object-cover"
      />
      <div className="p-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-brand-500">
          Product video{clips.length > 1 ? ` · ${activeIndex + 1}/${clips.length}` : ""}
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-black text-ink">{active.title}</p>
        <Link
          href={"/products/" + active.slug}
          className="mt-2 inline-flex text-xs font-black text-brand-900 underline decoration-brand-500 underline-offset-4 hover:text-brand-500"
        >
          View this product
        </Link>
      </div>
    </aside>
  );
}

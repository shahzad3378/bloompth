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

const ROTATE_EVERY_MS = 12_000;
const FASTDROP_LOGO_URL =
  "https://yejbtiivmozjuqyxsmny.supabase.co/storage/v1/object/public/tenant-branding/edb6f2a6-1e35-45b6-a60c-35b8ca4aa01e/logo.jpg?v=1791945182355";

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

  if (!active) {
    return (
      <Link
        href="/global-sourcing"
        aria-label="Explore BloomPath Personal Sourcing and international shipping"
        className="group block w-full overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-800 px-5 pb-5 pt-4 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full border-[22px] border-white/5"
          />
          <div className="relative flex items-center justify-between gap-3">
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-200">
              BLOOMPATH × FAST DROP
            </span>
            <img
              src={FASTDROP_LOGO_URL}
              alt="FastDrop Worldwide Logistics"
              className="h-9 max-w-[88px] rounded bg-white object-contain p-1"
            />
          </div>
          <h2 className="relative mt-5 text-[1.4rem] font-black leading-tight">
            Source anywhere.
            <br />
            Ship worldwide.
          </h2>
          <p className="relative mt-2 text-xs leading-5 text-white/80">
            Personal sourcing and international delivery for your business.
          </p>
          <div className="relative mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold">
              B2C
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold">
              B2B
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold">
              Canada · USA · Worldwide
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-black uppercase tracking-wider text-brand-500">
            BloomPath partners with FastDrop
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            International shipments between Canada and Dubai, with FastDrop
            coverage in the USA and worldwide for business and personal orders.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-900 underline decoration-brand-500 underline-offset-4 group-hover:text-brand-500">
            Explore Personal Sourcing <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
    <article
      aria-label={active.title + " featured product video"}
      className="w-full overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-lg"
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
    <Link href="/global-sourcing" className="group flex min-h-full flex-col justify-center overflow-hidden rounded-2xl border border-brand-900/10 bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-800 p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-200">BLOOMPATH × FAST DROP</span>
        <img src={FASTDROP_LOGO_URL} alt="FastDrop Worldwide Logistics" className="h-9 max-w-[88px] rounded bg-white object-contain p-1" />
      </div>
      <h2 className="mt-5 text-2xl font-black leading-tight">Source anywhere.<br />Ship worldwide.</h2>
      <p className="mt-2 text-sm leading-6 text-white/80">Personal sourcing and international delivery, with FastDrop B2B and B2C solutions for Canada, the USA and worldwide.</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black underline decoration-emerald-300 underline-offset-4 group-hover:text-emerald-200">Explore Personal Sourcing <span aria-hidden="true">→</span></span>
    </Link>
    </div>
  );
}

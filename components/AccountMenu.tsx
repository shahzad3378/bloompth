"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound } from "lucide-react";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(value => !value)} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
        <CircleUserRound size={20} /><span>Account</span><ChevronDown size={14} />
      </button>
      {open && (
        <section role="dialog" aria-label="BloomPath account menu" className="absolute right-0 top-full z-[80] mt-2 w-[min(92vw,350px)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
          <div className="p-5">
            <h2 className="text-lg font-black">Sign in to continue</h2>
            <p className="mt-1 text-sm text-slate-600">Access your BloomPath account and sourcing activity.</p>
            <Link href="/account/login" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-red-600 px-4 py-3 text-center text-sm font-black text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Sign in</Link>
            <p className="mt-3 text-center text-xs text-slate-500">New to BloomPath? <Link href="/signup" onClick={() => setOpen(false)} className="font-bold text-blue-700 hover:underline">Join as a seller</Link></p>
          </div>
          <div className="border-t border-slate-200 p-5">
            <p className="mb-3 text-sm font-black">Explore BloomPath</p>
            <nav className="grid gap-1 text-sm">
              <Link href="/products" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-slate-50">Products</Link>
              <Link href="/request-product" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-slate-50">Sourcing request</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-slate-50">Contact BloomPath</Link>
            </nav>
          </div>
        </section>
      )}
    </div>
  );
}

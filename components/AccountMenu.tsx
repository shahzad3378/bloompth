"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, Mail, Phone, X } from "lucide-react";

export default function AccountMenu({ phone = "+971 50 729 7900", email = "bloompathsms@gmail.com" }: { phone?: string; email?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof HTMLElement && event.target.dataset.accountBackdrop === "true") setOpen(false);
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

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(value => !value)} aria-label="Account" className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-sm font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 sm:gap-2 sm:px-3">
        <CircleUserRound size={20} /><span className="hidden sm:inline">Account</span><ChevronDown size={14} className="hidden sm:block" />
      </button>
      {open && (
        <div data-account-backdrop="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4" onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-label="BloomPath account menu" className="relative max-h-[min(84dvh,640px)] w-full max-w-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
          <div className="p-5 sm:p-6">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close account menu" className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><X size={18} /></button>
            <h2 className="pr-10 text-lg font-black">Sign in to continue</h2>
            <p className="mt-1 text-sm text-slate-600">Access your BloomPath account and sourcing activity.</p>
            <Link href="/account/login" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-red-600 px-4 py-3 text-center text-sm font-black text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Sign in</Link>
            <p className="mt-3 text-center text-xs text-slate-500">New to BloomPath? <Link href="/signup" onClick={() => setOpen(false)} className="font-bold text-blue-700 hover:underline">Join as a seller</Link></p>
          </div>
          <div className="border-t border-slate-200 p-5 sm:p-6">
            <p className="mb-3 text-sm font-black">Explore BloomPath</p>
            <nav className="grid gap-1 text-sm">
              <Link href="/products" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-slate-50">Products</Link>
              <Link href="/request-product" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-slate-50">Sourcing request</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-slate-50">Contact BloomPath</Link>
            </nav>
          </div>
          <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-5 text-sm sm:grid-cols-2 sm:p-6">
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="inline-flex min-w-0 items-center gap-2 font-semibold text-slate-700 hover:text-blue-700"><Phone size={16} className="shrink-0" /><span>{phone}</span></a>
            <a href={`mailto:${email}`} className="inline-flex min-w-0 items-center gap-2 font-semibold text-slate-700 hover:text-blue-700"><Mail size={16} className="shrink-0" /><span className="break-all">{email}</span></a>
          </div>
        </section>
        </div>
      )}
    </div>
  );
}

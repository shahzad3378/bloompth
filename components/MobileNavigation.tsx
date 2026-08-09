"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type NavigationLink = {
  name: string;
  href: string;
};

type MobileNavigationProps = {
  links: NavigationLink[];
};

export default function MobileNavigation({
  links,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-[100] flex flex-col bg-white text-slate-950 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black tracking-tight"
            >
              Bloom<span className="text-emerald-600">Path</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
              aria-label="Close navigation menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col px-6 py-6"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center rounded-xl px-4 py-4 text-lg font-bold text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-3 border-t border-slate-200 bg-slate-50 p-6">
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-bold text-slate-900"
            >
              Browse Products
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

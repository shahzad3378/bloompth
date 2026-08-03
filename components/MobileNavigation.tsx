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
    if (!isOpen) {
      return;
    }

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
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 transition hover:border-emerald-400 hover:text-emerald-400 lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-label="Close navigation menu"
          />

          <div
            id="mobile-navigation"
            className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white text-slate-950 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <div className="text-xl font-black">
                Bloom<span className="text-emerald-600">Path</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
                aria-label="Close navigation menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-6"
              aria-label="Mobile navigation"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-base font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="space-y-3 border-t border-slate-200 p-5">
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-800 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                Browse Products
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-400"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
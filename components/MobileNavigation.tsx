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
  whatsappUrl: string;
};

export default function MobileNavigation({
  links,
  whatsappUrl,
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
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-white text-ink shadow-sm transition hover:border-brand-500 hover:text-brand-900 xl:hidden"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-[100] flex flex-col bg-sand-100 text-ink xl:hidden"
        >
          <div className="flex items-center justify-between border-b border-line bg-white px-6 py-5">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="bp-display text-2xl"
            >
              Bloom<span className="text-brand-500">Path</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-white text-ink transition hover:border-brand-500 hover:text-brand-900"
              aria-label="Close navigation menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col overflow-y-auto px-6 py-6"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex cursor-pointer items-center rounded-xl px-4 py-4 text-lg font-bold transition hover:bg-white hover:text-brand-900"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="space-y-3 border-t border-line bg-white p-6">
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-line bg-white px-4 py-3.5 text-base font-bold text-ink transition hover:border-brand-500"
            >
              Browse Products
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-brand-900 px-4 py-3.5 text-base font-bold text-white transition hover:bg-brand-950"
            >
              Talk to an Expert
            </a>
          </div>
        </div>
      )}
    </>
  );
}

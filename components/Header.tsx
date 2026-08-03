import Image from "next/image";
import Link from "next/link";

import MobileNavigation from "@/components/MobileNavigation";
import { createClient } from "@/lib/supabase/server";

const mainNavLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
];

const mobileNavLinks = [
  ...mainNavLinks,
  { name: "Become a Seller", href: "/become-seller" },
  { name: "Contact Us", href: "/contact" },
];

export default async function Header() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("website_settings")
    .select("tagline")
    .eq("id", "main")
    .maybeSingle();

  const tagline =
    settings?.tagline?.trim() || "Grow Your Business - We Fulfill It";

  return (
    <>
      <div className="bg-emerald-600 px-4 py-2 text-center text-xs font-bold tracking-wide text-white sm:text-sm">
        {tagline}
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3">
          <Link
            href="/"
            className="shrink-0"
            aria-label="BloomPath homepage"
          >
            <Image
              src="/images/logo-full.png"
              alt="BloomPath"
              width={420}
              height={140}
              priority
              sizes="(max-width: 640px) 165px, 225px"
              className="h-auto w-[160px] object-contain sm:w-[195px] lg:w-[220px]"
            />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-8 text-sm font-semibold lg:flex"
            aria-label="Main navigation"
          >
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 text-slate-700 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all after:duration-200 hover:text-emerald-600 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/become-seller"
              className="hidden rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-bold text-emerald-600 transition-all duration-200 hover:bg-emerald-50 sm:inline-flex"
            >
              Become a Seller
            </Link>

            <Link
              href="/contact"
              className="hidden rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow-md sm:inline-flex"
            >
              Contact Us
            </Link>

            <MobileNavigation links={mobileNavLinks} />
          </div>
        </div>
      </header>
    </>
  );
}
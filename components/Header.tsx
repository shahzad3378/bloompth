import Image from "next/image";
import Link from "next/link";

import MobileNavigation from "@/components/MobileNavigation";
import { createClient } from "@/lib/supabase/server";

const mainNavLinks = [
  { name: "UAE Dropshipping", href: "/dropshipping-uae" },
  { name: "Products", href: "/products" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

const mobileNavLinks = [
  ...mainNavLinks,
  { name: "Contact Us", href: "/contact" },
];

function cleanWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export default async function Header() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("website_settings")
    .select("tagline, whatsapp")
    .eq("id", "main")
    .maybeSingle();

  const whatsapp = cleanWhatsAppNumber(
    settings?.whatsapp?.trim() || "971507297900"
  );

  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hello BloomPath, I want to discuss UAE dropshipping and fulfillment."
  )}`;

  return (
    <>
      <div className="bg-brand-950 px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.08em] text-white sm:text-xs">
        <span className="text-brand-500">UAE OPERATIONS</span>
        <span className="mx-2 text-white/35">/</span>
        Local warehousing, COD support and last-mile fulfillment for online sellers
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-xl">
        <div className="bp-container flex min-h-[76px] items-center justify-between gap-5 py-3">
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
              sizes="(max-width: 640px) 150px, 210px"
              className="h-auto w-[150px] object-contain sm:w-[188px] lg:w-[205px]"
            />
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-6 text-[13px] font-bold text-ink xl:flex"
            aria-label="Main navigation"
          >
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative cursor-pointer py-2 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-500 after:transition-all after:duration-200 hover:text-brand-900 hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/seller/login"
              className="hidden cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-brand-900 transition-colors hover:bg-brand-100 sm:inline-flex"
            >
              Seller Login
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden cursor-pointer rounded-xl bg-brand-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-950 hover:shadow-md sm:inline-flex"
            >
              Talk to an Expert
            </a>

            <MobileNavigation links={mobileNavLinks} whatsappUrl={whatsappUrl} />
          </div>
        </div>
      </header>
    </>
  );
}

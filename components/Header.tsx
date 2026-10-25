import Image from "next/image";
import { ChevronDown, Globe2, ShoppingBag } from "lucide-react";
import AccountMenu from "@/components/AccountMenu";
import MarketPreference from "@/components/MarketPreference";
import ScrollAwareNavigation from "@/components/ScrollAwareNavigation";
import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";


const mainNavLinks = [
  { name: "Dropshipping", href: "/dropshipping-uae" },
  { name: "About BloomPath", href: "/about" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Blog", href: "/blog" },
];



export default async function Header() {
  const countryCode = ((await headers()).get("x-vercel-ip-country") || "AE").toUpperCase();
  const supabase = await createClient();
  const { data: settings } = await supabase.from("website_settings").select("phone, email").eq("id", "main").maybeSingle();
  const phone = settings?.phone?.trim() || "+971 50 729 7900";
  const email = settings?.email?.trim() || "bloompathsms@gmail.com";
  return (
    <header data-scroll-hide-header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm transition-transform duration-200 ease-in-out">
      <div className="border-b border-slate-100 bg-white">
        <div className="bp-container flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 sm:min-h-[76px] sm:flex-nowrap sm:gap-4">
          <Link href="/" className="shrink-0" aria-label="BloomPath homepage">
            <Image src="/images/logo-full.png" alt="BloomPath" width={420} height={140} priority sizes="(max-width: 640px) 150px, 205px" className="h-auto w-[148px] object-contain sm:w-[180px]" style={{ filter: "hue-rotate(118deg) saturate(1.15)" }} />
          </Link>
          <div className="hidden flex-1 justify-end sm:flex"><MarketPreference initialCountryCode={countryCode} /></div>
          <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-3">
            <AccountMenu phone={phone} email={email} />
            <Link href="/products" aria-label="View product catalog" className="rounded-lg p-2.5 text-slate-700 hover:bg-blue-50"><ShoppingBag size={21}/></Link>
            <div className="w-full sm:hidden [&>div]:w-full [&>div]:justify-between [&_button]:whitespace-nowrap [&_button]:px-2"><MarketPreference initialCountryCode={countryCode} /></div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50">
        <ScrollAwareNavigation />
        <nav className="bp-container flex min-h-12 items-center justify-start gap-x-5 overflow-x-auto whitespace-nowrap text-sm font-semibold text-slate-700 md:justify-center md:gap-x-7 lg:gap-x-10" aria-label="Main navigation">
          <Link href="/products" className="inline-flex items-center gap-2 text-slate-900 hover:text-blue-700"><Globe2 size={16}/> Products <ChevronDown size={14}/></Link>
          {mainNavLinks.map(link => <Link key={link.href} href={link.href} className="py-3 transition-colors hover:text-blue-700">{link.name}</Link>)}
        </nav>
      </div>
    </header>
  );
}

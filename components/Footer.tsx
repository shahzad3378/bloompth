import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("website_settings")
    .select("*")
    .eq("id", "main")
    .single();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Company */}
          <div>
            <h2 className="text-3xl font-black">
              {settings?.company_name || "Bloom"}
              <span className="text-emerald-400">
                {settings?.company_name
                  ? ""
                  : "Path"}
              </span>
            </h2>

            <p className="mt-5 leading-7 text-slate-300">
              {settings?.tagline ||
                "BloomPath helps online sellers source quality products and grow their eCommerce business."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold">Quick Links</h3>

            <ul className="space-y-3 text-slate-300">
              <li>
                <Link href="/" className="hover:text-emerald-400">
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="hover:text-emerald-400"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="hover:text-emerald-400"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-emerald-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-lg font-bold">
              Services
            </h3>

            <ul className="space-y-3 text-slate-300">
              <li>Product Sourcing</li>
              <li>Dropshipping</li>
              <li>Wholesale Supply</li>
              <li>Fulfillment Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold">
              Contact Us
            </h3>

            <div className="space-y-3 text-slate-300">
              {settings?.address && (
                <p>📍 {settings.address}</p>
              )}

              {settings?.phone && (
                <p>
                  📞 <strong>{settings.phone}</strong>
                </p>
              )}

              {settings?.email && (
                <p>📧 {settings.email}</p>
              )}

              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-400"
                >
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          {settings?.footer_text ||
            `© ${new Date().getFullYear()} BloomPath. All Rights Reserved.`}
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Footer() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("website_settings")
    .select("*")
    .eq("id", "main")
    .single();

  const phone = settings?.phone?.trim() || "+971 50 729 7900";
  const email = settings?.email?.trim() || "bloompathsms@gmail.com";
  const whatsapp = (settings?.whatsapp?.trim() || "971507297900").replace(/\D/g, "");
  const address = settings?.address?.trim() || "Dubai, United Arab Emirates";

  return (
    <footer className="bg-brand-950 text-white">
      <div className="bp-container py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.15fr]">
          {/* Company */}
          <div className="max-w-sm">
            <div className="inline-flex rounded-2xl bg-white p-3">
              <Image
                src="/images/logo-full.png"
                alt="BloomPath"
                width={420}
                height={140}
                sizes="190px"
                className="h-auto w-[190px]"
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/68">
              Source products, store inventory and fulfill customer orders with one practical UAE e-commerce partner.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-bold text-brand-100">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              UAE-focused operations
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.14em] text-brand-500">Explore</h3>

            <ul className="space-y-3 text-sm text-white/68">
              <li>
                <Link href="/dropshipping-uae" className="cursor-pointer transition hover:text-white">
                  UAE Dropshipping
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="cursor-pointer transition hover:text-white"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="cursor-pointer transition hover:text-white"
                >
                  Seller Guides
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="cursor-pointer transition hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.14em] text-brand-500">Services</h3>

            <ul className="space-y-3 text-sm text-white/68">
              <li>Product Sourcing</li>
              <li>UAE Dropshipping</li>
              <li>Wholesale Supply</li>
              <li>Warehousing & Fulfillment</li>
              <li>COD & Last Mile Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.14em] text-brand-500">Contact</h3>

            <div className="space-y-4 text-sm text-white/68">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-brand-500" size={17} />{address}</p>
              <a href={`tel:${phone}`} className="flex cursor-pointer items-center gap-3 transition hover:text-white"><Phone className="shrink-0 text-brand-500" size={17} />{phone}</a>
              <a href={`mailto:${email}`} className="flex cursor-pointer items-center gap-3 break-all transition hover:text-white"><Mail className="shrink-0 text-brand-500" size={17} />{email}</a>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello BloomPath, I would like to discuss UAE fulfillment.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-bold text-brand-950 transition hover:bg-white"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
          {settings?.footer_text ||
            `© ${new Date().getFullYear()} BloomPath. All Rights Reserved.`}
          </p>
          <p>Grow your business — we fulfill it.</p>
        </div>
      </div>
    </footer>
  );
}

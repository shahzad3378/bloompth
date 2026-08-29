import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us | BloomPath",
  description:
    "Contact BloomPath for product sourcing, wholesale, dropshipping and fulfillment support in the UAE.",
};

function cleanWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("website_settings")
    .select(
      "company_name, tagline, phone, email, whatsapp, address"
    )
    .eq("id", "main")
    .maybeSingle();

  const companyName =
    settings?.company_name?.trim() || "BloomPath";

  const tagline =
    settings?.tagline?.trim() ||
    "Helping online sellers source quality products and grow their eCommerce business.";

  const phone = settings?.phone?.trim() || "+971 50 729 7900";
  const email = settings?.email?.trim() || "bloompathsms@gmail.com";
  const whatsapp = settings?.whatsapp?.trim() || "971507297900";
  const address = settings?.address?.trim() || "Dubai, United Arab Emirates";

  const whatsappNumber = cleanWhatsAppNumber(whatsapp);

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hello ${companyName}, I would like to know more about your services.`
      )}`
    : "";

  return (
    <main className="min-h-screen bg-sand-100">
      <section className="relative overflow-hidden bg-brand-950 px-5 py-20 text-white sm:py-24">
        <div className="bp-grid-pattern pointer-events-none absolute inset-0 opacity-75" />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="bp-eyebrow text-brand-500">Contact BloomPath</span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s map your UAE fulfillment setup.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
            {tagline}
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-900">
              <Building2 size={28} />
            </div>

            <h2 className="mt-6 text-3xl font-black text-ink">
              Contact Information
            </h2>

            <p className="mt-4 leading-7 text-muted">
              Speak with the {companyName} team about product
              sourcing, wholesale supply, dropshipping, fulfillment
              or seller partnership opportunities.
            </p>

            <div className="mt-8 space-y-4">
              {address && (
                <div className="flex items-start gap-4 rounded-2xl bg-sand-100 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <MapPin size={21} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Address
                    </p>

                    <p className="mt-1 font-bold leading-6 text-slate-950">
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-4 rounded-2xl bg-sand-100 p-5 transition hover:bg-brand-100"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <Phone size={21} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      {phone}
                    </p>
                  </div>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 rounded-2xl bg-sand-100 p-5 transition hover:bg-brand-100"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <Mail size={21} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-all font-bold text-slate-950">
                      {email}
                    </p>
                  </div>
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-2xl bg-sand-100 p-5 transition hover:bg-brand-100"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <MessageCircle size={21} />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      WhatsApp
                    </p>

                    <p className="mt-1 font-bold text-brand-900">
                      Chat with us
                    </p>
                  </div>
                </a>
              )}

              {!address && !phone && !email && !whatsappUrl && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">
                  Contact information has not been added in Admin
                  Settings yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-brand-950 p-6 text-white shadow-xl sm:p-10">
            <p className="bp-eyebrow text-brand-500">
              Quick Actions
            </p>

            <h2 className="mt-3 text-3xl font-black">
              How can we help?
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Share your product, expected order flow and sales channel. We&apos;ll
              help identify the next operational step.
            </p>

            <div className="mt-8 space-y-4">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-4 font-bold text-brand-950 transition hover:bg-white"
              >
                <ShoppingBag size={20} />
                Browse Products
              </Link>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  <MessageCircle size={20} />
                  Contact on WhatsApp
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(
                    `${companyName} Service Inquiry`
                  )}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  <Mail size={20} />
                  Send Email
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  <Phone size={20} />
                  Call Us
                </a>
              )}
            </div>

            <div className="mt-10 rounded-2xl bg-white/5 p-6">
              <h3 className="text-lg font-black">
                Our Services
              </h3>

              <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 px-4 py-3">
                  Product Sourcing
                </div>

                <div className="rounded-xl bg-white/5 px-4 py-3">
                  Wholesale Supply
                </div>

                <div className="rounded-xl bg-white/5 px-4 py-3">
                  Dropshipping
                </div>

                <div className="rounded-xl bg-white/5 px-4 py-3">
                  Fulfillment Support
                </div>
              </div>
            </div>

            <p className="mt-8 text-sm leading-6 text-slate-400">
              All contact details on this page are loaded directly
              from the website settings.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

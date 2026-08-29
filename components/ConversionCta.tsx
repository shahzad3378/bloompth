import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function ConversionCta() {
  const whatsappUrl =
    "https://wa.me/971507297900?text=Hello%20BloomPath%2C%20I%20want%20a%20UAE%20sourcing%20and%20fulfillment%20consultation.";

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="bp-container">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-900 px-6 py-12 text-white shadow-[0_24px_70px_rgba(7,62,42,0.2)] sm:px-10 lg:px-14 lg:py-14">
          <div className="bp-grid-pattern pointer-events-none absolute inset-0 opacity-55" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <p className="bp-eyebrow text-brand-500">Build your UAE operation</p>
              <h2 className="bp-display mt-4 text-3xl sm:text-5xl">
                Tell us what you sell. We&apos;ll map the next operational step.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                Share your product type, expected monthly orders and current
                selling channel. We will confirm available sourcing, stock and
                fulfillment options.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-sm font-black text-brand-950 transition hover:bg-white"
              >
                <MessageCircle size={18} /> Talk on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-black text-white transition hover:border-white hover:bg-white/10"
              >
                Contact details <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

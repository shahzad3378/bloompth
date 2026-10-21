import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, ClipboardCheck, Handshake, MapPin, Warehouse } from "lucide-react";
import ConversionCta from "@/components/ConversionCta";

export const metadata: Metadata = {
  title: "About BloomPath",
  description: "Meet BloomPath, a product sourcing and fulfillment partner connecting stock locations with customer destinations.",
  alternates: { canonical: "/about" },
};

const principles = [
  { icon: ClipboardCheck, title: "Clarity before volume", description: "We clarify product origin, availability, destination, pricing and delivery options before confirming a sourcing request." },
  { icon: Warehouse, title: "Local operating focus", description: "We coordinate sourcing and delivery across supported markets, including local stock where available." },
  { icon: Handshake, title: "A practical partnership", description: "We support B2B, B2C, C2C and B2B2C sourcing and fulfillment, with last-mile support confirmed by route." },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-sky-50 py-16 text-slate-900 sm:py-24">
        <div className="bp-grid-pattern pointer-events-none absolute inset-0 opacity-80" />
        <div className="bp-container relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="bp-eyebrow text-blue-700">About BloomPath</p>
            <h1 className="bp-display mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">Global sourcing and fulfillment across markets.</h1>
          </div>
          <div className="border-l border-blue-200 pl-6 sm:pl-8">
            <p className="text-base leading-8 text-slate-600 sm:text-lg">BloomPath connects product sourcing, local inventory and delivery so buyers can source from one market and fulfill in another.</p>
            <Link href="/dropshipping-uae" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-500 transition hover:text-white">
              See how we work <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="bp-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-sand-100 p-7 sm:p-10">
            <div className="bp-dot-pattern absolute inset-0 opacity-60" />
            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-brand-500"><MapPin size={26} /></span>
              <p className="bp-eyebrow mt-8 text-brand-900">Built to connect markets</p>
              <p className="bp-display mt-3 text-4xl text-ink sm:text-5xl">Local context changes the fulfillment equation.</p>
              <div className="mt-8 grid grid-cols-2 gap-3 text-sm font-black text-brand-900">
                {["Local stock", "COD workflow", "Order prep", "Last mile"].map((item) => <span key={item} className="rounded-xl border border-brand-900/10 bg-white p-4">{item}</span>)}
              </div>
            </div>
          </div>
          <div className="lg:pl-8">
            <p className="bp-eyebrow text-brand-900">Why we exist</p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">Make the path from product to doorstep easier to manage.</h2>
            <p className="mt-6 text-base leading-8 text-muted sm:text-lg">Businesses and sourcing buyers often outgrow fragmented spreadsheets, supplier chats and unclear delivery handoffs. BloomPath connects product sourcing, stock locations and delivery into one coordinated workflow.</p>
            <p className="mt-5 text-base leading-8 text-muted sm:text-lg">We are not a shortcut to guaranteed sales. We are the practical infrastructure partner that helps a well-run store fulfill its customer promise more consistently.</p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-line bg-sand-100 p-5">
              <Boxes className="shrink-0 text-brand-900" size={28} />
              <p className="text-sm font-bold leading-6 text-ink/75">Product and service availability is confirmed with each seller before launch.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-sand-100 py-16 sm:py-24">
        <div className="bp-container">
          <div className="max-w-3xl">
            <p className="bp-eyebrow text-brand-900">How we work</p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">Clear responsibilities. Fewer surprises.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <article key={principle.title} className="rounded-[1.35rem] border border-line bg-white p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900"><Icon size={21} /></span>
                    <span className="text-xs font-black text-brand-900/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-black text-ink">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{principle.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <ConversionCta />
    </main>
  );
}

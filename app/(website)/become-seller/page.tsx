import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MessageCircle, PackageSearch, ShoppingBag, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a UAE Seller",
  description: "Start your BloomPath seller journey with product discovery and UAE fulfillment support.",
  alternates: { canonical: "/become-seller" },
};

const steps = [
  { icon: PackageSearch, title: "Choose your product direction", description: "Browse available products or share the type of product you want us to source." },
  { icon: MessageCircle, title: "Confirm the operating terms", description: "Discuss stock, pricing, packing, delivery coverage and COD coordination with our team." },
  { icon: Truck, title: "Send confirmed orders", description: "Once your workflow is approved, share complete orders for preparation and dispatch." },
];

export default function BecomeSellerPage() {
  const whatsappUrl = "https://wa.me/971507297900?text=Hello%20BloomPath%2C%20I%20want%20to%20become%20a%20UAE%20seller.";
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-sand-100 py-16 sm:py-24">
        <div className="bp-dot-pattern pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-50" />
        <div className="bp-container relative grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
          <div>
            <p className="bp-eyebrow text-brand-900">BloomPath seller onboarding</p>
            <h1 className="bp-display mt-5 max-w-3xl text-5xl text-ink sm:text-6xl lg:text-7xl">Build the storefront. We&apos;ll help organize fulfillment.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">A practical starting path for UAE online sellers who need product access, local stock options and a clearer order-to-delivery workflow.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 py-3.5 text-sm font-black text-white transition hover:bg-brand-950">
                Start on WhatsApp <ArrowRight size={18} />
              </a>
              <Link href="/products" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-brand-900/20 bg-white px-6 py-3.5 text-sm font-black text-brand-900 transition hover:border-brand-900">
                <ShoppingBag size={18} /> Browse products
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-brand-950 p-7 text-white shadow-[0_28px_80px_rgba(5,44,32,0.22)] sm:p-9">
            <p className="bp-eyebrow text-brand-500">Before your first order</p>
            <h2 className="mt-3 text-2xl font-black">We confirm the working setup.</h2>
            <ul className="mt-7 space-y-4">
              {["Product and stock availability", "Seller pricing and payment terms", "Packing and order-sharing method", "Delivery coverage and COD process"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-white/72"><Check size={17} className="mt-1 shrink-0 text-brand-500" />{item}</li>
              ))}
            </ul>
            <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/45">Approval and service availability depend on the selected product, order requirements and agreed commercial terms.</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="bp-container">
          <div className="max-w-3xl"><p className="bp-eyebrow text-brand-900">Three-step start</p><h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">From product idea to dispatch-ready.</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-[1.35rem] border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900"><Icon size={21} /></span><span className="text-xs font-black text-brand-900/35">0{index + 1}</span></div>
                  <h3 className="mt-6 text-xl font-black text-ink">{step.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-900 py-14 text-white sm:py-18">
        <div className="bp-container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="bp-eyebrow text-brand-500">Ready to explore?</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Tell us what you want to sell in the UAE.</h2></div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-4 text-sm font-black text-brand-950 transition hover:bg-white"><MessageCircle size={18} /> Talk to the team</a>
        </div>
      </section>
    </main>
  );
}

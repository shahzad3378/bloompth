import { ArrowRight, Boxes, CircleDollarSign, PackageCheck, Store, Truck, Users } from "lucide-react";
import Link from "next/link";

const models = [
  { code: "B2B", title: "Business to Business", text: "Wholesale sourcing and repeat stock for retailers, resellers and growing businesses.", icon: Boxes },
  { code: "B2C", title: "Business to Consumer", text: "Sell direct to shoppers with fulfillment and last-mile delivery options.", icon: Store },
  { code: "C2C", title: "Consumer to Consumer", text: "Move peer-to-peer orders and parcels between people across supported routes.", icon: Users },
  { code: "B2B2C", title: "Business to Business to Consumer", text: "Help brands and retail partners reach end customers through a connected supply chain.", icon: PackageCheck },
];

export default function BusinessModels() {
  return (
    <section className="relative overflow-hidden bg-[#e9f8fc] py-16 sm:py-24">
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/80 blur-3xl" />
      <div className="bp-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-500 shadow-sm">One global network</span>
          <h2 className="bp-display mt-5 text-3xl text-ink sm:text-5xl">One partner for every way you sell.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted">From wholesale supply to peer-to-peer parcels, choose a model that fits the business and the customer journey.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <article key={model.code} className="group rounded-3xl border border-white bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#fff1f2] px-3 py-1.5 text-xs font-black tracking-widest text-brand-500">{model.code}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f8fc] text-brand-900"><Icon size={21} /></span>
                </div>
                <h3 className="mt-5 text-lg font-black text-ink">{model.title}</h3>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted">{model.text}</p>
                <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-xs font-bold text-brand-900"><Truck size={15} className="text-brand-500" /> Last-mile support available by route</div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-between gap-5 rounded-3xl border border-blue-100 bg-blue-50 p-7 text-slate-900 sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Origin to destination</p>
              <h3 className="mt-2 text-2xl font-black">Global sourcing. Local last mile.</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Choose where stock ships from and where it needs to go. Delivery partner, service and rates are confirmed for each lane.</p>
            </div>
            <Link href="/request-product" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-black text-white transition hover:brightness-95">Plan a route <ArrowRight size={16} /></Link>
          </div>
          <div className="rounded-3xl border border-white bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1f2] text-brand-500"><CircleDollarSign size={20} /></span><p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Carrier integrations</p></div>
            <h3 className="mt-4 text-xl font-black text-ink">Connect logistics providers by route.</h3>
            <p className="mt-2 text-sm leading-6 text-muted">Carrier accounts, API access and service lanes can be configured for live rates, labels and tracking. Last-mile support remains route-specific.</p>
            <p className="mt-4 rounded-xl bg-[#e9f8fc] px-4 py-3 text-xs font-bold text-brand-900">Integration status: Setup required for each provider</p>
          </div>
        </div>
      </div>
    </section>
  );
}

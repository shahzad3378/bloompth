import Link from "next/link";
import { ArrowRight, Globe2, PackageCheck, Route } from "lucide-react";

const originMarkets = [
  { flag: "🇨🇦", name: "Canada", region: "North America" },
  { flag: "🇺🇸", name: "United States", region: "North America" },
  { flag: "🇦🇪", name: "United Arab Emirates", region: "West Asia" },
  { flag: "🇵🇰", name: "Pakistan", region: "South Asia" },
  { flag: "🇨🇳", name: "China", region: "East Asia" },
];

export default function GlobalSourcingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-blue-100 bg-sky-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-blue-800">
              <Globe2 size={15} /> Global product sourcing
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Source from the market that works best for you.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Tell us what product you need, where you want it sourced from and where it should go. We will confirm availability, pricing and delivery options for that route.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/request-product" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700">
                Request sourcing <ArrowRight size={17} />
              </Link>
              <Link href="/products" className="inline-flex items-center rounded-xl border border-blue-200 bg-white px-5 py-3 font-black text-blue-900 hover:bg-blue-50">
                Browse available products
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">Source by origin</p>
            <h2 className="mt-2 text-2xl font-black">Markets in our sourcing network</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">The product catalogue will show the actual stock origin when it is provided for each item.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {originMarkets.map((market) => (
                <div key={market.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <span className="text-2xl" aria-hidden="true">{market.flag}</span>
                  <span><strong className="block text-sm">{market.name}</strong><small className="text-slate-500">{market.region}</small></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3">
        {[
          { icon: PackageCheck, title: "Share product details", body: "Send the item, quantity, preferred origin and destination." },
          { icon: Globe2, title: "Review the sourcing quote", body: "We confirm stock availability, pricing and the route options." },
          { icon: Route, title: "Plan delivery to destination", body: "Last-mile support is confirmed for the selected route." },
        ].map(({ icon: Icon, title, body }, index) => (
          <article key={title} className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><Icon size={21} /></span>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-red-600">0{index + 1}</p>
            <h2 className="mt-2 text-xl font-black">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

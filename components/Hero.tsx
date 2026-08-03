import {
  BadgeCheck,
  Banknote,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

const benefits = [
  {
    icon: Warehouse,
    title: "UAE Warehouse",
    description: "Local stock for faster order processing",
  },
  {
    icon: Banknote,
    title: "COD Support",
    description: "Cash on Delivery support where available",
  },
  {
    icon: Truck,
    title: "Middle East Delivery",
    description: "Reliable last-mile delivery across key markets",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8 lg:py-14">
        <div className="max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:text-sm">
            <BadgeCheck size={17} />
            Your Complete eCommerce Growth Partner
          </div>

          <h1 className="mt-5 max-w-6xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Launch, Scale & Fulfill Your eCommerce Business Across the{" "}
            <span className="text-emerald-600">Middle East</span>
          </h1>

          <p className="mt-5 max-w-5xl text-base leading-8 text-slate-600 sm:text-lg">
            BloomPath helps Amazon, Noon, Shopify, TikTok Shop, Facebook and
            Instagram sellers source products faster, store inventory in our
            UAE warehouse, reduce operational costs, improve profit margins and
            deliver orders through reliable COD and last-mile fulfillment
            solutions across the UAE and GCC.
          </p>

          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {benefit.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Fast Sourcing",
              "Amazon & Noon Ready",
              "TikTok Shop Support",
              "Facebook & Instagram Selling",
              "Lower Costs",
              "Higher Margins",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

const highlights = [
  "Quality Products",
  "UAE-Based Support",
  "Fast Fulfillment",
  "Dedicated Assistance",
];

const features = [
  {
    title: "Quality Products",
    description:
      "Browse carefully selected products suitable for online sellers and growing eCommerce businesses.",
  },
  {
    title: "No Inventory Hassle",
    description:
      "Source products without managing large quantities of stock or making heavy upfront investments.",
  },
  {
    title: "UAE Fulfillment Support",
    description:
      "Get reliable support for product sourcing, storage, packing and order fulfillment.",
  },
  {
    title: "Simple Seller Onboarding",
    description:
      "Choose products, contact our team and start selling through your preferred online channels.",
  },
];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            Product sourcing and dropshipping support in the UAE
          </span>

          <h1 className="mt-7 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Start Your
            <span className="text-emerald-400"> Dropshipping Business </span>
            with BloomPath
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover products for your online store and contact BloomPath for
            sourcing and fulfillment support. We help sellers start simply and
            grow step by step.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-emerald-500 px-7 py-4 text-base font-bold text-white transition hover:bg-emerald-400"
            >
              Browse Products
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/30 px-7 py-4 text-base font-bold text-white transition hover:bg-white hover:text-slate-950"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <div className="text-lg font-black text-emerald-400">✓</div>
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
              Why BloomPath
            </p>

            <h2 className="mt-3 text-3xl font-black">
              A simpler way to start selling online
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white p-5 text-slate-900 shadow-lg"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                    ✓
                  </div>

                  <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
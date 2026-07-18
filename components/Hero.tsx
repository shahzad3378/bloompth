const features = [
  {
    title: "Ready Stock in UAE",
    description: "Products available locally for fast order processing.",
  },
  {
    title: "Same-Day Dispatch",
    description: "Confirmed orders can be prepared and dispatched quickly.",
  },
  {
    title: "Wholesale Prices",
    description: "Competitive pricing specially designed for online sellers.",
  },
  {
    title: "Dedicated Support",
    description: "Our UAE team is ready to assist sellers with their orders.",
  },
];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      <div className="mx-auto grid min-h-[620px] max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            UAE Ready Stock for Online Sellers
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Powering UAE Sellers with{" "}
            <span className="text-emerald-400">
              Ready Stock & Fast Fulfillment
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Access ready-stock products in the UAE without investing heavily in
            inventory. We store, pack and dispatch while you focus on growing
            your online business.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-lg bg-emerald-500 px-7 py-4 font-bold text-white transition hover:bg-emerald-400">
              Become a Seller
            </button>

            <button className="rounded-lg border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950">
              Browse Products
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
            <span>✓ Ready stock in UAE</span>
            <span>✓ Fast dispatch</span>
            <span>✓ Seller support</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl bg-white p-5 text-slate-900 shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                  ✓
                </div>

                <h2 className="font-bold">{feature.title}</h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
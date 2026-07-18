const bloompthBenefits = [
  "Ready stock available in the UAE",
  "Same-day order processing",
  "Flexible wholesale quantities",
  "UAE-based seller support",
  "Product images and descriptions",
  "Packing and dispatch assistance",
];

const otherSupplierProblems = [
  "Long international shipping time",
  "High minimum order quantities",
  "Import and customs delays",
  "No dedicated local support",
  "Manual packing and fulfillment",
  "Uncertain product availability",
];

export default function WhyChoose() {
  return (
    <section id="about" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            Why Sellers Choose Us
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            A better way to source and fulfill orders in the UAE
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            BLOOMPTH helps online sellers access ready stock, local support and
            faster fulfillment without importing products themselves.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="text-xl font-black text-slate-950">
              Other Suppliers
            </h3>

            <div className="mt-6 space-y-4">
              {otherSupplierProblems.map((problem) => (
                <div
                  key={problem}
                  className="flex items-start gap-3 rounded-xl bg-red-50 p-4"
                >
                  <span className="font-black text-red-500">✕</span>
                  <p className="text-sm font-medium text-slate-700">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <div className="flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-lg font-black text-white shadow-xl">
              VS
            </div>
          </div>

          <article className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
            <h3 className="text-xl font-black">
              Why Choose <span className="text-emerald-400">BLOOMPTH</span>
            </h3>

            <div className="mt-6 space-y-4">
              {bloompthBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl bg-white/5 p-4"
                >
                  <span className="font-black text-emerald-400">✓</span>
                  <p className="text-sm font-medium text-slate-200">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-7 py-10 text-white shadow-xl sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-100">
                Start Your Seller Journey
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Become a BLOOMPTH seller today
              </h3>

              <p className="mt-3 max-w-2xl text-emerald-50">
                Register your seller account and get access to UAE-ready stock,
                wholesale pricing and fulfillment support.
              </p>
            </div>

            <button className="shrink-0 rounded-xl bg-white px-7 py-4 font-black text-emerald-700 transition hover:bg-slate-950 hover:text-white">
              Register as Seller
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
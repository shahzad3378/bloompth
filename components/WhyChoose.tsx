import Link from "next/link";

const bloomPathBenefits = [
  "Browse products selected for online selling",
  "UAE-based sourcing and fulfillment support",
  "Simple process for new and growing sellers",
  "Local assistance for product inquiries",
  "Clear stock and product information",
  "Step-by-step support to get started",
];

const traditionalChallenges = [
  "Large upfront inventory purchases",
  "Long international shipping times",
  "Import and customs complications",
  "High minimum order quantities",
  "Limited local support",
  "Difficult product sourcing process",
];

export default function WhyChoose() {
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-slate-100 to-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
            Why BloomPath?
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
            A Simpler Way to Source Products
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            BloomPath helps online sellers discover products and connect with
            local sourcing and fulfillment support in the UAE.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-lg">
            <h3 className="text-center text-2xl font-black text-red-600">
              Common Supplier Challenges
            </h3>

            <div className="mt-8 space-y-4">
              {traditionalChallenges.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl bg-red-50 p-4"
                >
                  <span className="text-xl font-black text-red-600">✕</span>

                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-950 text-2xl font-black text-white shadow-2xl">
              VS
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
            <h3 className="text-center text-2xl font-black">
              The Bloom
              <span className="text-emerald-400">Path</span> Approach
            </h3>

            <div className="mt-8 space-y-4">
              {bloomPathBenefits.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-2xl bg-white/5 p-4"
                >
                  <span className="text-xl font-black text-emerald-400">✓</span>

                  <p className="text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 p-8 text-white shadow-2xl sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold uppercase tracking-wider">
                Get Started
              </span>

              <h3 className="mt-6 text-3xl font-black sm:text-4xl">
                Ready to Explore Products for Your Online Store?
              </h3>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-50">
                Browse available products and contact BloomPath for sourcing,
                stock availability and fulfillment information.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/products"
                className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-emerald-700 transition hover:bg-slate-900 hover:text-white"
              >
                Browse Products
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white px-8 py-4 text-lg font-bold transition hover:bg-white hover:text-emerald-700"
              >
                Contact BloomPath
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
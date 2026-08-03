import Link from "next/link";

const services = [
  {
    title: "Product Sourcing",
    description:
      "We help online sellers discover practical products suitable for eCommerce businesses.",
  },
  {
    title: "Dropshipping Support",
    description:
      "Sellers can explore available products and contact BloomPath for stock and fulfillment information.",
  },
  {
    title: "UAE Fulfillment",
    description:
      "We support local order preparation and fulfillment solutions for sellers operating in the UAE.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <span className="rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
            About BloomPath
          </span>

          <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
            Helping Online Sellers Grow with Confidence
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            BloomPath connects online sellers with selected products, local
            support and practical fulfillment solutions in the UAE.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Who We Are
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              A Simple Platform for Product Discovery
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              BloomPath is designed for new and growing online sellers who need
              an easier way to discover products and understand local stock and
              fulfillment options.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Our goal is to make product sourcing more accessible by providing
              clear information, direct assistance and a simple way to connect
              with our team.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-10 text-white shadow-2xl">
            <h3 className="text-3xl font-black">Our Mission</h3>

            <p className="mt-5 text-lg leading-8 text-emerald-50">
              To help online sellers start and grow their businesses through
              practical product sourcing, local support and dependable
              fulfillment solutions.
            </p>

            <h3 className="mt-10 text-3xl font-black">Our Vision</h3>

            <p className="mt-5 text-lg leading-8 text-emerald-50">
              To become a trusted product and fulfillment partner for
              eCommerce sellers across the UAE.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              What We Do
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              Services Designed for Online Sellers
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl bg-white p-8 shadow-lg"
              >
                <h3 className="text-2xl font-black text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-4xl font-black text-slate-900">
            Ready to Explore BloomPath Products?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Browse available products or contact our team for stock, pricing and
            fulfillment information.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-700"
            >
              Browse Products
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-slate-300 px-8 py-4 font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
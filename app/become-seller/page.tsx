import Link from "next/link";

export default function BecomeSellerPage() {
  return (
    <main className="bg-white">
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold uppercase tracking-wider">
            Become a Seller
          </span>

          <h1 className="mt-6 text-5xl font-black">
            Grow Your Business with BloomPath
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-emerald-50">
            Looking for products to sell online? BloomPath helps sellers explore
            available products and connect with our team for sourcing and
            fulfillment support.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-100 p-8">
              <h3 className="text-2xl font-black">Browse Products</h3>
              <p className="mt-4 text-slate-600">
                Explore our product catalogue and discover items suitable for
                your online business.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-8">
              <h3 className="text-2xl font-black">Contact Our Team</h3>
              <p className="mt-4 text-slate-600">
                Discuss pricing, stock availability and fulfillment options with
                our specialists.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-8">
              <h3 className="text-2xl font-black">Start Selling</h3>
              <p className="mt-4 text-slate-600">
                Once everything is confirmed, you can begin offering products to
                your customers.
              </p>
            </div>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-950 p-12 text-center text-white">
            <h2 className="text-4xl font-black">
              Ready to Get Started?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Our team is ready to answer your questions and help you take the
              next step.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white hover:bg-emerald-400"
              >
                Browse Products
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-white px-8 py-4 font-bold hover:bg-white hover:text-slate-900"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
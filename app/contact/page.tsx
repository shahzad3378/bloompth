import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <span className="rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-bold uppercase tracking-wider text-emerald-400">
            Contact Us
          </span>

          <h1 className="mt-6 text-5xl font-black">
            We'd Love to Hear From You
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
            Whether you're looking for products, wholesale pricing, or
            fulfillment support, our team is here to help.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-100 p-10">
            <h2 className="text-3xl font-black text-slate-900">
              Contact Information
            </h2>

            <div className="mt-8 space-y-6 text-lg">
              <div>
                <h3 className="font-bold">📍 Address</h3>
                <p>Dubai, United Arab Emirates</p>
              </div>

              <div>
                <h3 className="font-bold">📞 Phone</h3>
                <p>+971 XX XXX XXXX</p>
              </div>

              <div>
                <h3 className="font-bold">📧 Email</h3>
                <p>sales@bloompath.com</p>
              </div>

              <div>
                <h3 className="font-bold">💬 WhatsApp</h3>
                <a
                  href="https://wa.me/971000000000"
                  className="text-emerald-600 font-bold"
                >
                  Chat with us
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-3xl font-black text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-8 space-y-5">
              <Link
                href="/products"
                className="block rounded-xl bg-emerald-600 px-6 py-4 text-center font-bold text-white hover:bg-emerald-700"
              >
                Browse Products
              </Link>

              <a
                href="https://wa.me/971507297900"
                className="block rounded-xl border border-slate-300 px-6 py-4 text-center font-bold hover:bg-slate-100"
              >
                Contact on WhatsApp
              </a>

              <a
                href="mailto:bloompathsms@gmail.com"
                className="block rounded-xl border border-slate-300 px-6 py-4 text-center font-bold hover:bg-slate-100"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
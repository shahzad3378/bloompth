import Link from "next/link";
import { ArrowLeft, BadgeCheck, Headphones, ShieldCheck } from "lucide-react";
import RequestProductForm from "@/components/RequestProductForm";

export default function RequestProductPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1 className="mt-6 text-4xl font-black sm:text-5xl">
            Request a Product
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Tell us what product you need, the required quantity and your
            business location. BloomPath will review your request and contact
            you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:py-12 lg:grid-cols-[1fr_360px] lg:items-start">
        <RequestProductForm />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <h2 className="text-xl font-black">
              Why request through BloomPath?
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <BadgeCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="font-black">Product Sourcing</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    We review products suitable for your online business.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="font-black">Business Support</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Discuss pricing, stock and fulfillment requirements.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Headphones
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="font-black">Direct Assistance</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Our team will contact you after reviewing the request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wider text-emerald-600">
              No online payment
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Submitting this form does not create an order or charge your
              account. It only sends your product requirement to BloomPath.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, BadgeCheck, Headphones, ShieldCheck } from "lucide-react";
import { headers } from "next/headers";
import { countries } from "@/lib/countries";
import RequestProductForm from "@/components/RequestProductForm";

export default async function RequestProductPage() {
  const countryCode = ((await headers()).get("x-vercel-ip-country") || "AE").toUpperCase();
  const initialCountry = countries.find((country) => country.code === countryCode)?.name || "United Arab Emirates";
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-14">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <h1 className="mt-4 text-3xl font-black sm:mt-6 sm:text-5xl">
            Sourcing for Business or Personal Needs
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-lg sm:leading-8">
            Looking for a product anywhere in the world? Whether you are
            shopping for yourself, trading, buying wholesale or running an
            online business, BloomPath can help source it and arrange delivery
            to your country. We will confirm the product cost, service fee and
            delivery charges with you before proceeding.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl min-w-0 gap-5 px-4 py-6 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_360px] lg:items-start">
        <Suspense fallback={<div>Loading...</div>}>
          <RequestProductForm initialCountry={initialCountry} />
        </Suspense>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <h2 className="text-xl font-black">
              Source and shop with BloomPath
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <BadgeCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="font-black">Worldwide Product Sourcing</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Tell us the product and where you want it sourced from. We
                    help individuals, traders and online businesses.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="font-black">Personal Shopping &amp; Trading</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    If you cannot shop in person, we can help purchase the
                    items and arrange delivery to your country.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Headphones
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>
                  <p className="font-black">Clear Costs, Global Delivery</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    We confirm the product price, BloomPath service fee and
                    delivery charges before moving ahead.
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

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  PackageSearch,
  Search,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ProductCatalog from "@/components/ProductCatalog";

export const revalidate = 0;

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, title, slug, description, category, price, sale_price, stock, image, featured"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const totalProducts = products?.length ?? 0;

  const featuredProducts =
    products?.filter((product) => product.featured).length ?? 0;

  const availableProducts =
    products?.filter((product) => Number(product.stock) > 0).length ?? 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                <ShoppingBag size={15} />
                BloomPath Product Catalog
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Products for Online Sellers
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Explore wholesale products, dropshipping opportunities and
                sourcing options selected for e-commerce sellers in the UAE.
              </p>
            </div>

            <Link
              href="/request-product"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Request a Product
              <ArrowRight size={18} />
            </Link>
          </div>

          {!error && totalProducts > 0 && (
            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-black sm:text-3xl">
                  {totalProducts}
                </p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Total products
                </p>
              </div>

              <div>
                <p className="text-2xl font-black sm:text-3xl">
                  {availableProducts}
                </p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Available now
                </p>
              </div>

              <div>
                <p className="text-2xl font-black sm:text-3xl">
                  {featuredProducts}
                </p>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Featured items
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <PackageSearch size={26} />
            </div>

            <h2 className="mt-5 text-xl font-black text-red-900">
              Unable to load products
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {error.message}
            </p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <PackageSearch size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-950">
              Products are coming soon
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
              BloomPath is currently adding new products. You can send us your
              requirement and our team will help source the product.
            </p>

            <Link
              href="/request-product"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
            >
              Request a Product
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
                  Product Collection
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
                  Find products for your business
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                <Search size={17} />
                Search and filter below
              </div>
            </div>

            <ProductCatalog products={products} />
          </>
        )}
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 rounded-3xl bg-slate-950 p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-emerald-400">
                Need a different product?
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Tell us what you want to sell
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                Share your product requirement, target quantity and destination.
                BloomPath will review your request and contact you.
              </p>
            </div>

            <Link
              href="/request-product"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Send Requirement
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
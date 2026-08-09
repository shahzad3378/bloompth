import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const supabaseAdmin = createAdminClient();

  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, title, slug, category, price, sale_price, stock, image, status")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
      <Link
        href="/seller"
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Seller Catalog
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Browse Products
        </h1>

        <p className="mt-2 text-slate-500">
          View products available for wholesale ordering.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error.message}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <PackageSearch className="mx-auto text-slate-400" size={36} />
          <p className="mt-4 font-bold text-slate-700">
            No products available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const displayPrice = product.sale_price ?? product.price;

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-square bg-slate-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <PackageSearch size={32} />
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    {product.category || "General"}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-sm font-black text-slate-950 sm:text-lg">
                    {product.title}
                  </h2>

                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Wholesale Price
                    </p>

                    <p className="mt-1 text-base font-black text-slate-950 sm:text-xl">
                      {displayPrice !== null
                        ? `AED ${Number(displayPrice).toFixed(2)}`
                        : "Contact for Price"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Stock: {product.stock ?? 0}
                    </p>
                  </div>

                  <Link
                    href={`/seller/products/${product.slug}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-black text-white"
                  >
                    View & Order
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

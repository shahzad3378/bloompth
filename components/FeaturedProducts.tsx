import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  price: number | null;
  sale_price: number | null;
  stock: number;
  image: string | null;
  featured: boolean;
};

export const revalidate = 0;

export default async function FeaturedProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, title, slug, description, category, price, sale_price, stock, image, featured"
    )
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <section id="products" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
              Featured Products
            </span>

            <h2 className="mt-5 text-4xl font-black text-slate-950">
              Products for Online Sellers
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Explore selected products available through BloomPath for
              sourcing and dropshipping support.
            </p>
          </div>

          <Link
            href="/products"
            className="text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            View All Products →
          </Link>
        </div>

        {error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load products: {error.message}
          </div>
        )}

        {!error && (!products || products.length === 0) && (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              Featured products are coming soon
            </h3>

            <p className="mt-2 text-slate-600">
              Browse the complete catalogue to view available products.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-emerald-600"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!error && products && products.length > 0 && (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: Product) => {
              const displayPrice = product.sale_price ?? product.price;

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                        No product image
                      </div>
                    )}

                    {product.stock > 0 && (
                      <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {product.category || "General"}
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-950">
                      {product.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {product.description ||
                        "Contact BloomPath for sourcing details."}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-2 text-xs font-bold ${
                          product.stock > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stock > 0
                          ? `${product.stock} pcs available`
                          : "Out of Stock"}
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {displayPrice
                          ? `AED ${Number(displayPrice).toFixed(2)}`
                          : "Contact for Price"}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="mt-6 block w-full rounded-xl bg-slate-950 px-5 py-3.5 text-center font-bold text-white transition hover:bg-emerald-600"
                    >
                      View Product Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
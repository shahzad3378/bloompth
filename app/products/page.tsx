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
  status: "active" | "inactive";
};

export const revalidate = 0;

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, title, slug, description, category, price, sale_price, stock, image, featured, status"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-semibold text-emerald-400">
            ← Back to Home
          </Link>

          <h1 className="mt-6 text-4xl font-black sm:text-5xl">
            BloomPath Products
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Browse products available for dropshipping and sourcing in the UAE.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load products: {error.message}
          </div>
        )}

        {!error && products?.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Products are coming soon
            </h2>
            <p className="mt-3 text-slate-600">
              BloomPath is currently adding new sourcing products.
            </p>
          </div>
        )}

        {!error && products && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square bg-slate-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                      No product image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {product.category && (
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {product.category}
                    </p>
                  )}

                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    {product.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {product.description || "Product details available on request."}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        product.stock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      Contact for Price
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-5 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-600"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
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
  let { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, description, category, price, sale_price, stock, image, featured, origin_country, stock_country, currency_code")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Keep the catalogue available until the additive global sourcing migration is applied.
  if (error) {
    const legacy = await supabase
      .from("products")
      .select("id, title, slug, description, category, price, sale_price, stock, image, featured")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    products = legacy.data?.map((product) => ({ ...product, origin_country: null, stock_country: null, currency_code: null })) ?? null;
    error = legacy.error;
  }

  const totalProducts = products?.length ?? 0;

  const featuredProducts =
    products?.filter((product) => product.featured).length ?? 0;

  const availableProducts =
    products?.filter((product) => Number(product.stock) > 0).length ?? 0;

  return (
    <main className="min-h-screen bg-white">
      

      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
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
        ) : false ? (
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
          </div>
        ) : (
          <>
            <ProductCatalog products={products ?? []} />
          </>
        )}
      </section>
    </main>
  );
}
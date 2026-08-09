import Link from "next/link";
import {
  ArrowRight,
  ImageIcon,
  PackageCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string | number;
  title: string;
  slug: string;
  category: string | null;
  price: number | null;
  sale_price: number | null;
  stock: number | null;
  image: string | null;
  featured: boolean;
};

export const revalidate = 0;

export default async function FeaturedProducts() {
  const {
    data: featuredProducts,
    error: featuredError,
  } = await supabase
    .from("products")
    .select(
      "id, title, slug, category, price, sale_price, stock, image, featured"
    )
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", {
      ascending: false,
    })
    .limit(4);

  let products = featuredProducts as Product[] | null;
  let error = featuredError;

  if (
    !featuredError &&
    (!featuredProducts || featuredProducts.length === 0)
  ) {
    const {
      data: latestProducts,
      error: latestError,
    } = await supabase
      .from("products")
      .select(
        "id, title, slug, category, price, sale_price, stock, image, featured"
      )
      .eq("status", "active")
      .order("created_at", {
        ascending: false,
      })
      .limit(4);

    products = latestProducts as Product[] | null;
    error = latestError;
  }

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <section
      id="products"
      className="border-b border-slate-200 bg-white py-12 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
              Trending Products
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Products Ready for Your Store
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Explore popular products available for wholesale sourcing and
              UAE-based fulfillment.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden shrink-0 items-center gap-2 text-sm font-black text-emerald-700 transition hover:text-emerald-600 sm:inline-flex"
          >
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => {
            const price =
              product.price !== null ? Number(product.price) : null;

            const salePrice =
              product.sale_price !== null
                ? Number(product.sale_price)
                : null;

            const hasSale =
              salePrice !== null &&
              price !== null &&
              salePrice < price;

            const displayPrice = hasSale ? salePrice : price;
            const stock = Number(product.stock ?? 0);

            return (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block overflow-hidden bg-slate-50"
                >
                  <div className="flex aspect-square items-center justify-center p-2 sm:p-5">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400">
                        <ImageIcon size={34} />

                        <span className="text-xs font-bold">
                          No product image
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-black shadow-sm ${
                      stock > 0
                        ? "bg-white text-emerald-700"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {stock > 0 && <PackageCheck size={13} />}

                    {stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>

                  {hasSale && (
                    <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-black text-white shadow-sm">
                      Sale
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col border-t border-slate-100 p-3 sm:p-4">
                  <p className="truncate text-[11px] font-black uppercase tracking-[0.14em] text-emerald-600">
                    {product.category || "General"}
                  </p>

                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-black leading-5 sm:min-h-[48px] sm:text-base sm:leading-6 text-slate-950 transition group-hover:text-emerald-600">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Wholesale Price
                </p>

                <Link
                  href="/seller/login"
                  className="mt-2 inline-flex items-center rounded-lg bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
                >
                  🔒 Login to View Price
                </Link>
              </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-2 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm font-black text-white transition hover:bg-emerald-600"
                  >
                    View Product
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href="/products"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-5 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-50 sm:hidden"
        >
          View All Products
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
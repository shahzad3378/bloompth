import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageIcon, PackageCheck } from "lucide-react";
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
  const { data: featuredProducts, error: featuredError } = await supabase
    .from("products")
    .select("id, title, slug, category, price, sale_price, stock, image, featured")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  let products = featuredProducts as Product[] | null;
  let error = featuredError;

  if (!featuredError && (!featuredProducts || featuredProducts.length === 0)) {
    const { data: latestProducts, error: latestError } = await supabase
      .from("products")
      .select("id, title, slug, category, price, sale_price, stock, image, featured")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(4);

    products = latestProducts as Product[] | null;
    error = latestError;
  }

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <section id="products" className="border-b border-line bg-white py-16 sm:py-24">
      <div className="bp-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="bp-eyebrow text-brand-900">
              Available product opportunities
            </p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
              Products ready for your next test.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Explore active products available for seller review, wholesale
              sourcing and UAE-based fulfillment discussions.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden shrink-0 cursor-pointer items-center gap-2 text-sm font-black text-brand-900 transition hover:gap-3 sm:inline-flex"
          >
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => {
            const price = product.price === null ? null : Number(product.price);
            const salePrice =
              product.sale_price === null ? null : Number(product.sale_price);
            const hasSale =
              salePrice !== null && price !== null && salePrice < price;
            const stock = Number(product.stock ?? 0);

            return (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-xl"
              >
                <Link
                  href={"/products/" + product.slug}
                  className="relative block cursor-pointer overflow-hidden bg-sand-100"
                >
                  <div className="relative flex aspect-square items-center justify-center">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-5"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
                        <ImageIcon size={34} />
                        <span className="text-xs font-bold">No product image</span>
                      </div>
                    )}
                  </div>

                  <span
                    className={
                      "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-black shadow-sm " +
                      (stock > 0
                        ? "bg-white text-brand-900"
                        : "bg-red-600 text-white")
                    }
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

                <div className="flex flex-1 flex-col border-t border-line p-3 sm:p-4">
                  <p className="truncate text-[11px] font-black uppercase tracking-[0.14em] text-brand-900">
                    {product.category || "General"}
                  </p>

                  <Link href={"/products/" + product.slug} className="cursor-pointer">
                    <h3 className="mt-2 line-clamp-2 min-h-[40px] text-sm font-black leading-5 text-ink transition group-hover:text-brand-900 sm:min-h-[48px] sm:text-base sm:leading-6">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                      Wholesale price
                    </p>
                    <Link
                      href="/seller/login"
                      className="mt-2 inline-flex cursor-pointer items-center rounded-lg bg-brand-100 px-3 py-2 text-xs font-black text-brand-900 transition hover:bg-sand-100"
                    >
                      🔒 Login to view price
                    </Link>
                  </div>

                  <Link
                    href={"/products/" + product.slug}
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-950 px-2 py-2.5 text-xs font-black text-white transition hover:bg-brand-900 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    View product
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href="/products"
          className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-900 bg-white px-5 py-3 text-sm font-black text-brand-900 transition hover:bg-brand-100 sm:hidden"
        >
          View all products
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

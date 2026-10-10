import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  PackageSearch,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireActiveSellerPage } from "@/lib/auth";
import SellerOrderBox from "@/components/SellerOrderBox";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SellerProductDetailPage({
  params,
}: PageProps) {
  await requireActiveSellerPage();

  const { slug } = await params;
  const supabaseAdmin = createAdminClient();

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select(
      "id, title, slug, description, category, price, sale_price, stock, image, status, min_order_qty"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error || !product) {
    notFound();
  }

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

  // Temporary MOQ.
  // Later this will come from products.min_order_qty.
  const minimumOrderQty = Number(product.min_order_qty ?? 1);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-5 sm:p-8">
        <Link
          href="/seller/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-square bg-slate-50 p-5 sm:p-8">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                  <PackageSearch size={48} />
                  <p className="font-semibold">
                    No product image
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Product Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              {product.category || "General"}
            </p>

            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
                  <BadgeCheck size={14} />
                  In Stock
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
                  Out of Stock
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                <Warehouse size={14} />
                UAE Warehouse
              </span>
            </div>

            <div className="mt-7 rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Wholesale Price
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-3">
                <p className="text-3xl font-black">
                  {displayPrice !== null
                    ? `AED ${displayPrice.toFixed(2)}`
                    : "Contact for Price"}
                </p>

                {hasSale && price !== null && (
                  <p className="pb-1 text-sm font-bold text-slate-400 line-through">
                    AED {price.toFixed(2)}
                  </p>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Price per unit
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Available Stock
                </p>

                <p className="mt-2 text-2xl font-black text-slate-950">
                  {stock}
                </p>

                <p className="text-xs text-slate-500">
                  units
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Minimum Order
                </p>

                <p className="mt-2 text-2xl font-black text-slate-950">
                  {minimumOrderQty}
                </p>

                <p className="text-xs text-slate-500">
                  units
                </p>
              </div>
            </div>

            {product.description && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h2 className="font-black text-slate-950">
                  Product Details
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                  {product.description}
                </p>
              </div>
            )}

            <SellerOrderBox
              productId={String(product.id)}
              productTitle={product.title}
              unitPrice={displayPrice}
              stock={stock}
              minimumOrderQty={minimumOrderQty}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

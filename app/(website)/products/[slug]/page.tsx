import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Expand,
  Mail,
  MessageCircle,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, title, slug, description, category, price, sale_price, stock, image, featured, status"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const typedProduct = product as Product;

  const displayPrice =
    typedProduct.sale_price ?? typedProduct.price;

  const hasSale =
    typedProduct.sale_price !== null &&
    typedProduct.price !== null &&
    Number(typedProduct.sale_price) <
      Number(typedProduct.price);

  const discountPercentage = hasSale
    ? Math.round(
        ((Number(typedProduct.price) -
          Number(typedProduct.sale_price)) /
          Number(typedProduct.price)) *
          100
      )
    : 0;

  const stock = Number(typedProduct.stock ?? 0);

  const requestUrl = `/request-product?product=${encodeURIComponent(
    typedProduct.title
  )}&productId=${typedProduct.id}`;

  const whatsappMessage = encodeURIComponent(
    `Hello BloomPath,

I am interested in this product:

Product: ${typedProduct.title}
Category: ${typedProduct.category ?? "General"}

Please share wholesale pricing, minimum order quantity and dropshipping details.`
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 text-white">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 transition hover:text-emerald-300"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:py-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Product Image */}
        <div className="relative z-20 space-y-5">
          <div className="group relative rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Main Image Container */}
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white p-6 sm:p-8">
              {typedProduct.image ? (
                <>
                  <img
                    src={typedProduct.image}
                    alt={typedProduct.title}
                    className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Hover Instruction */}
                  <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/85 px-4 py-2 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:inline-flex">
                    <Expand size={14} />
                    Hover for larger preview
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-400">
                  <PackageSearch size={52} />

                  <span className="font-semibold">
                    No product image
                  </span>
                </div>
              )}
            </div>

            {/* Stock and Sale Badges */}
            <div className="absolute left-4 top-4 z-20 flex flex-col items-start gap-2">
              <span
                className={`rounded-full px-4 py-2 text-xs font-black shadow-sm ${
                  stock > 0
                    ? "bg-white text-emerald-700"
                    : "bg-red-600 text-white"
                }`}
              >
                {stock > 0
                  ? "Available"
                  : "Out of Stock"}
              </span>

              {hasSale && (
                <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white shadow-sm">
                  {discountPercentage}% Off
                </span>
              )}
            </div>

            {/* Featured Badge */}
            {typedProduct.featured && (
              <span className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-sm">
                <Sparkles size={14} />
                Featured
              </span>
            )}

            {/* Large Hover Popup Preview */}
            {typedProduct.image && (
              <div className="pointer-events-none absolute left-[calc(100%+20px)] top-0 z-50 hidden w-[520px] translate-x-3 rounded-3xl border border-slate-200 bg-white p-5 opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 xl:block">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-4">
                  <img
                    src={typedProduct.image}
                    alt={`${typedProduct.title} large preview`}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                    Product Preview
                  </p>

                  <p className="mt-1 line-clamp-1 text-base font-black text-slate-950">
                    {typedProduct.title}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Product Benefits */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <BadgeCheck
                size={21}
                className="text-emerald-600"
              />

              <p className="mt-3 text-sm font-black text-slate-950">
                Verified Product
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Reviewed by BloomPath
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <Truck
                size={21}
                className="text-emerald-600"
              />

              <p className="mt-3 text-sm font-black text-slate-950">
                UAE Fulfillment
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Delivery support available
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <ShieldCheck
                size={21}
                className="text-emerald-600"
              />

              <p className="mt-3 text-sm font-black text-slate-950">
                Seller Support
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Sourcing assistance included
              </p>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="relative z-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-600">
              {typedProduct.category || "General"}
            </p>

            {typedProduct.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                <Sparkles size={12} />
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {typedProduct.title}
          </h1>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {typedProduct.description ||
              "Contact BloomPath for complete sourcing, wholesale and dropshipping details for this product."}
          </p>

          {/* Pricing */}
          <div className="mt-7 border-y border-slate-100 py-6">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Starting price
            </p>

            <div className="mt-2 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-black text-slate-950">
                {displayPrice !== null
                  ? `AED ${Number(
                      displayPrice
                    ).toFixed(2)}`
                  : "Contact for Price"}
              </span>

              {hasSale && (
                <span className="pb-1 text-lg font-bold text-slate-400 line-through">
                  AED{" "}
                  {Number(
                    typedProduct.price
                  ).toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Final wholesale pricing may depend on quantity
              and sourcing requirements.
            </p>
          </div>

          {/* Availability */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Availability
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2
                  size={19}
                  className={
                    stock > 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }
                />

                <p
                  className={`font-black ${
                    stock > 0
                      ? "text-emerald-700"
                      : "text-red-600"
                  }`}
                >
                  {stock > 0
                    ? `${stock} pieces available`
                    : "Currently unavailable"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                Business Model
              </p>

              <p className="mt-2 font-black text-slate-950">
                Wholesale & Dropshipping
              </p>
            </div>
          </div>

          {/* Product Request */}
          <div className="mt-7 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
            <h2 className="text-xl font-black text-slate-950">
              Interested in this product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Submit your requirement to discuss quantity,
              wholesale price, availability and fulfillment
              support.
            </p>

            <Link
              href={requestUrl}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-black text-white transition hover:bg-emerald-700"
            >
              Request This Product
              <ArrowRight size={18} />
            </Link>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <a
                href={`https://wa.me/971000000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>

              <a
                href={`mailto:sales@bloompath.com?subject=${encodeURIComponent(
                  `Product Inquiry: ${typedProduct.title}`
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <Mail size={17} />
                Send Email
              </a>
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            No online payment is required. BloomPath will
            contact you after reviewing your product request.
          </p>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
            <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-emerald-400">
                  Cannot find what you need?
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Request any product for your business
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  Share your product requirement with
                  BloomPath and our team will review available
                  sourcing options.
                </p>
              </div>

              <Link
                href="/request-product"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-black text-slate-950 transition hover:bg-emerald-400"
              >
                Request Another Product
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
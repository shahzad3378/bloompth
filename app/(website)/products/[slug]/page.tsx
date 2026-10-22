import Link from "next/link";
import CurrencyPrice from "@/components/CurrencyPrice";
import { currencyForCountryName, flagForCountryName } from "@/lib/countries";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import ProductImageGallery from "@/components/ProductImageGallery";

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  price: number | null;
  sale_price: number | null;
  stock: number;
  min_order_qty: number;
  image: string | null;
  images?: string[] | null;
  featured: boolean;
  status: "active" | "inactive";
  origin_country?: string | null;
  stock_country?: string | null;
  currency_code?: string | null;
};

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const visitorCountryCode = ((await headers()).get("x-vercel-ip-country") || "AE").toUpperCase();
  const visitorCurrency = currencyForCountryName(visitorCountryCode) || "USD";
  const { slug } = await params;

  const { data: contactSettings } = await supabase
    .from("website_settings")
    .select("phone, whatsapp, email")
    .eq("id", "main")
    .maybeSingle();
  const contactPhone = contactSettings?.phone?.trim() || "+971 50 729 7900";
  const whatsappNumber = (contactSettings?.whatsapp?.trim() || "+971507297900").replace(/\D/g, "");
  const contactEmail = contactSettings?.email?.trim() || "bloompathsms@gmail.com";

  let { data: product, error } = await supabase
    .from("products")
    .select("id, title, slug, description, category, price, sale_price, stock, min_order_qty, image, images, featured, status, origin_country, stock_country, currency_code")
    .eq("slug", slug).eq("status", "active").maybeSingle();

  if (error) {
    const legacy = await supabase.from("products")
      .select("id, title, slug, description, category, price, sale_price, stock, min_order_qty, image, featured, status")
      .eq("slug", slug).eq("status", "active").maybeSingle();
    product = legacy.data ? { ...legacy.data, images: legacy.data.image ? [legacy.data.image] : [], origin_country: null, stock_country: null, currency_code: null } : null;
    error = legacy.error;
  }

  if (error || !product) {
    notFound();
  }

  const typedProduct = product as Product;
  const productImages = typedProduct.images?.length
    ? typedProduct.images
    : typedProduct.image
      ? [typedProduct.image]
      : [];

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
  const minimumOrder = Math.max(1, Number(typedProduct.min_order_qty ?? 1));

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
        <div className="relative z-20 min-w-0 space-y-5">
          <div className="relative rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Main Image Container */}
            <ProductImageGallery images={productImages} title={typedProduct.title} />
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
                Destination-based fulfillment
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
          <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-slate-700">
            <span aria-hidden="true">📍 {flagForCountryName(typedProduct.stock_country || "")}</span>
            {typedProduct.stock_country ? `Available in: ${typedProduct.stock_country}` : "Stock location not listed"}
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
            <span aria-hidden="true">🌐 {flagForCountryName(typedProduct.origin_country || "")}</span>
            Origin: {typedProduct.origin_country || "Not listed"}
          </div>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {typedProduct.description ||
              "Contact BloomPath for complete sourcing, wholesale and dropshipping details for this product."}
          </p>

          {/* Pricing */}
          <div className="mt-7 border-y border-slate-100 py-6">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Starting price
            </p>

            <div className="mt-2">
              {displayPrice !== null
                ? <CurrencyPrice amount={Number(displayPrice)} baseCurrency={typedProduct.currency_code || currencyForCountryName(typedProduct.stock_country || "") || "USD"} targetCurrency={visitorCurrency} />
                : <span className="text-3xl font-black text-slate-950">Contact for Price</span>}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Final wholesale pricing may depend on quantity
              and sourcing requirements.
            </p>
            {hasSale && <span className="mt-3 inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">Save {discountPercentage}%</span>}
          </div>

          {/* Availability */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">
                {typedProduct.stock_country ? `Available in: ${typedProduct.stock_country}` : "Availability"}
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
                Minimum Order
              </p>

              <p className="mt-2 font-black text-slate-950">
                {minimumOrder} pieces
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
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-black text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                <MessageCircle size={17} />
                WhatsApp {contactPhone}
              </a>

              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  `Product Inquiry: ${typedProduct.title}`
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <Mail size={17} />
                {contactEmail}
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

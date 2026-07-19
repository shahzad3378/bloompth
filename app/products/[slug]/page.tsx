import Link from "next/link";
import { notFound } from "next/navigation";
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
      "id, title, slug, description, category, price, sale_price, stock, image, status"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const typedProduct = product as Product;
  const displayPrice = typedProduct.sale_price ?? typedProduct.price;

  const whatsappMessage = encodeURIComponent(
    `Hello BloomPath,\n\nI am interested in sourcing this product:\n\nProduct: ${typedProduct.title}\nCategory: ${typedProduct.category ?? "General"}\n\nPlease share product and dropshipping details.`
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="text-sm font-bold text-emerald-400 hover:text-emerald-300"
          >
            ← Back to Products
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="aspect-square bg-slate-100">
            {typedProduct.image ? (
              <img
                src={typedProduct.image}
                alt={typedProduct.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-semibold text-slate-400">
                No product image
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            {typedProduct.category || "General"}
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
            {typedProduct.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {typedProduct.description ||
              "Contact BloomPath for complete sourcing and dropshipping details."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Availability</p>
              <p
                className={`mt-2 text-lg font-black ${
                  typedProduct.stock > 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {typedProduct.stock > 0
                  ? `${typedProduct.stock} pieces available`
                  : "Out of stock"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Price</p>
              <p className="mt-2 text-lg font-black text-slate-950">
                {displayPrice
                  ? `AED ${Number(displayPrice).toFixed(2)}`
                  : "Contact for Price"}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h2 className="text-xl font-black text-slate-950">
              Interested in sourcing this product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Contact BloomPath to discuss wholesale pricing, availability and
              dropshipping support.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/971000000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-bold text-white transition hover:bg-emerald-500"
              >
                Contact on WhatsApp
              </a>

              <a
                href={`mailto:sales@bloompath.com?subject=${encodeURIComponent(
                  `Product Inquiry: ${typedProduct.title}`
                )}`}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-900 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
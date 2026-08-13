import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProductForm from "./EditProductForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  if (!id) {
    notFound();
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        description,
        category,
        price,
        sale_price,
        stock,
        min_order_qty,
        min_order_qty,
        image,
        featured,
        status,
        created_at
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            Products
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Edit Product
          </h1>

          <p className="mt-2 text-slate-500">
            Product information, price, stock aur image update karein.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-700">
            Product load nahi ho saka.
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error.message}
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            Products
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Edit Product
          </h1>

          <p className="mt-2 text-slate-500">
            Product information, price, stock aur image update karein.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-100"
        >
          Back to Products
        </Link>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}

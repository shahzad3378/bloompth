import Link from "next/link";
import { Download, Plus, Upload } from "lucide-react";

import { supabase } from "@/lib/supabase";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Product = {
  id: string | number;
  title: string | null;
  slug: string | null;
  category: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  stock: number | null;
  image: string | null;
  featured: boolean | null;
  status: string | null;
  created_at: string | null;
};

export default async function AdminProductsPage() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        title,
        slug,
        category,
        price,
        sale_price,
        stock,
        image,
        featured,
        status,
        created_at
      `
    )
    .order("created_at", {
      ascending: false,
    });

  const products = (data ?? []) as Product[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Products
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Manage Products
          </h1>

          <p className="mt-2 text-slate-500">
            Products, prices, stock aur visibility manage karein.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/admin/products/import"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            <Upload size={18} />
            Import CSV
          </Link>

          <Link
            href="/admin/products/export"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Download size={18} />
            Export CSV
          </Link>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
          >
            <Plus size={18} />
            Add New Product
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-bold text-red-700">
            Products load nahi ho sake.
          </p>

          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Abhi koi product nahi hai
          </h2>

          <p className="mt-2 text-slate-500">
            Manual product add karein ya CSV file se bulk products import
            karein.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/admin/products/import"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 font-bold text-emerald-700"
            >
              <Upload size={18} />
              Import CSV
            </Link>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm font-semibold text-slate-600">
              Total Products:{" "}
              <span className="font-black text-slate-950">
                {products.length}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const regularPrice = Number(product.price ?? 0);

                  const salePrice =
                    product.sale_price === null ||
                    product.sale_price === undefined ||
                    product.sale_price === ""
                      ? null
                      : Number(product.sale_price);

                  return (
                    <tr
                      key={String(product.id)}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.title || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-950">
                              {product.title || "Untitled Product"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              ID: {String(product.id)}
                            </p>

                            {product.featured && (
                              <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {product.category || "Uncategorized"}
                      </td>

                      <td className="px-6 py-5">
                        {salePrice !== null && salePrice > 0 ? (
                          <div>
                            <p className="font-bold text-emerald-600">
                              AED {salePrice.toFixed(2)}
                            </p>

                            <p className="text-xs text-slate-400 line-through">
                              AED {regularPrice.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-bold text-slate-900">
                            AED {regularPrice.toFixed(2)}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                        {product.stock ?? 0}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            product.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {product.status || "draft"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${encodeURIComponent(
                              String(product.id)
                            )}`}
                            className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                          >
                            Edit
                          </Link>

                          <DeleteProductButton
                            productId={String(product.id)}
                            productTitle={
                              product.title || "Untitled Product"
                            }
                                        />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
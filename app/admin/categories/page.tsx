import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RecentProduct = {
  id: string | number;
  title: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  stock: number | null;
  status: string | null;
  created_at: string | null;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    productsCountResult,
    featuredCountResult,
    categoriesCountResult,
    usersCountResult,
    recentProductsResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("featured", true),

    supabase
      .from("categories")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("products")
      .select(
        `
          id,
          title,
          price,
          sale_price,
          stock,
          status,
          created_at
        `
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  const totalProducts = productsCountResult.count ?? 0;
  const featuredProducts = featuredCountResult.count ?? 0;
  const totalCategories = categoriesCountResult.count ?? 0;
  const staffUsers = usersCountResult.count ?? 0;

  const recentProducts =
    (recentProductsResult.data ?? []) as RecentProduct[];

  const dashboardError =
    productsCountResult.error ||
    featuredCountResult.error ||
    categoriesCountResult.error ||
    usersCountResult.error ||
    recentProductsResult.error;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-950">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {dashboardError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-bold text-red-700">
            Dashboard data load karne mein problem hui.
          </p>

          <p className="mt-2 text-sm text-red-600">
            {dashboardError.message}
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          accentClass="bg-blue-500"
          href="/admin/products"
        />

        <DashboardCard
          title="Featured Products"
          value={featuredProducts}
          accentClass="bg-emerald-500"
          href="/admin/products"
        />

        <DashboardCard
          title="Categories"
          value={totalCategories}
          accentClass="bg-orange-500"
          href="/admin/categories"
        />

        <DashboardCard
          title="Staff Users"
          value={staffUsers}
          accentClass="bg-purple-500"
          href="/admin/users"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-950">
              Recent Products
            </h2>

            <Link
              href="/admin/products"
              className="text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
            >
              View All
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-8">
              <p className="text-slate-500">
                No products to display yet.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                Add First Product
              </Link>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {recentProducts.map((product) => {
                const regularPrice = Number(product.price ?? 0);

                const salePrice =
                  product.sale_price === null ||
                  product.sale_price === undefined ||
                  product.sale_price === ""
                    ? null
                    : Number(product.sale_price);

                return (
                  <Link
                    key={String(product.id)}
                    href={`/admin/products/${encodeURIComponent(
                      String(product.id)
                    )}`}
                    className="flex items-center justify-between gap-4 py-4 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-950">
                        {product.title || "Untitled Product"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Stock: {product.stock ?? 0}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-bold text-slate-900">
                        AED{" "}
                        {salePrice !== null && salePrice > 0
                          ? salePrice.toFixed(2)
                          : regularPrice.toFixed(2)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                          product.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.status || "draft"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Quick Actions
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Add Product
            </Link>

            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Add Category
            </Link>

            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 transition hover:bg-slate-100"
            >
              Manage Products
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  value: number;
  accentClass: string;
  href: string;
};

function DashboardCard({
  title,
  value,
  accentClass,
  href,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className={`h-2 w-14 rounded-full ${accentClass}`}
      />

      <p className="mt-6 text-sm font-bold text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-4xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-4 text-sm font-semibold text-emerald-600 opacity-0 transition group-hover:opacity-100">
        Open →
      </p>
    </Link>
  );
}

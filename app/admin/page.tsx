import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  Package,
  PackageCheck,
  PackagePlus,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RecentProduct = {
  id: string | number;
  title: string | null;
  category: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  stock: number | null;
  status: string | null;
  featured: boolean | null;
  created_at: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(value);
}

function getStatusClasses(status: string | null) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "published") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (normalizedStatus === "inactive") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    productsResult,
    categoriesResult,
    activeProductsResult,
    featuredProductsResult,
    lowStockResult,
    inventoryResult,
    recentProductsResult,
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("categories")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("featured", true),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .lte("stock", 5),

    supabase
      .from("products")
      .select("price, sale_price, stock"),

    supabase
      .from("products")
      .select(
        "id, title, category, price, sale_price, stock, status, featured, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalProducts = productsResult.count ?? 0;
  const totalCategories = categoriesResult.count ?? 0;
  const activeProducts = activeProductsResult.count ?? 0;
  const featuredProducts = featuredProductsResult.count ?? 0;
  const lowStockProducts = lowStockResult.count ?? 0;

  const recentProducts =
    (recentProductsResult.data as RecentProduct[] | null) ?? [];

  const inventoryProducts = inventoryResult.data ?? [];

  const totalStock = inventoryProducts.reduce((total, product) => {
    return total + Number(product.stock ?? 0);
  }, 0);

  const inventoryValue = inventoryProducts.reduce((total, product) => {
    const regularPrice = Number(product.price ?? 0);
    const salePrice = Number(product.sale_price ?? 0);
    const finalPrice = salePrice > 0 ? salePrice : regularPrice;
    const stock = Number(product.stock ?? 0);

    return total + finalPrice * stock;
  }, 0);

  const outOfStockProducts = inventoryProducts.filter(
    (product) => Number(product.stock ?? 0) <= 0
  ).length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      description: `${activeProducts} active products`,
      href: "/admin/products",
      icon: Package,
      iconClasses: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Categories",
      value: totalCategories.toLocaleString(),
      description: "Product catalog categories",
      href: "/admin/categories",
      icon: Tags,
      iconClasses: "bg-blue-100 text-blue-700",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(inventoryValue),
      description: `${totalStock.toLocaleString()} total stock units`,
      href: "/admin/products",
      icon: CircleDollarSign,
      iconClasses: "bg-violet-100 text-violet-700",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.toLocaleString(),
      description: `${outOfStockProducts} products out of stock`,
      href: "/admin/products",
      icon: AlertTriangle,
      iconClasses: "bg-amber-100 text-amber-700",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      href: "/admin/products/new",
      icon: PackagePlus,
    },
    {
      title: "Manage Products",
      description: "Update prices, stock and visibility",
      href: "/admin/products",
      icon: Boxes,
    },
    {
      title: "Manage Categories",
      description: "Create and organize categories",
      href: "/admin/categories",
      icon: Tags,
    },
    {
      title: "Website Settings",
      description: "Manage BloomPath configuration",
      href: "/admin/settings",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              <Clock3 size={15} />
              Admin Dashboard
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back to BloomPath
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Manage products, categories, inventory and website operations
              from one central dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              View Products
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400"
            >
              <PackagePlus size={18} />
              Add New Product
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClasses}`}
                >
                  <Icon size={23} />
                </div>

                <ArrowRight
                  size={19}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                />
              </div>

              <p className="mt-6 text-sm font-bold text-slate-500">
                {stat.title}
              </p>

              <p className="mt-2 break-words text-3xl font-black text-slate-950">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {stat.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Recent Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Recently added products in your catalog
              </p>
            </div>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Package size={42} className="mx-auto text-slate-300" />

              <h3 className="mt-4 text-lg font-black text-slate-950">
                No products found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add your first product to start building the BloomPath catalog.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                <PackagePlus size={17} />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      Product
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
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentProducts.map((product) => {
                    const regularPrice = Number(product.price ?? 0);
                    const salePrice = Number(product.sale_price ?? 0);
                    const finalPrice =
                      salePrice > 0 ? salePrice : regularPrice;

                    return (
                      <tr
                        key={String(product.id)}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <p className="max-w-[220px] truncate font-bold text-slate-950">
                            {product.title || "Untitled Product"}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            {product.category || "Uncategorized"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="text-sm font-black text-slate-900">
                            {formatCurrency(finalPrice)}
                          </p>

                          {salePrice > 0 && salePrice < regularPrice && (
                            <p className="mt-1 text-xs text-slate-400 line-through">
                              {formatCurrency(regularPrice)}
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                              Number(product.stock ?? 0) <= 0
                                ? "bg-rose-100 text-rose-700"
                                : Number(product.stock ?? 0) <= 5
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {Number(product.stock ?? 0)} units
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${getStatusClasses(
                              product.status
                            )}`}
                          >
                            {product.status || "draft"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-right">
                          <Link
                            href={`/admin/products/${encodeURIComponent(
                              String(product.id)
                            )}`}
                            className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Catalog Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current product visibility summary
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <PackageCheck size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Active Products
                    </p>
                    <p className="text-xs text-slate-500">
                      Visible in catalog
                    </p>
                  </div>
                </div>

                <p className="text-xl font-black text-emerald-700">
                  {activeProducts}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                    <Package size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Featured Products
                    </p>
                    <p className="text-xs text-slate-500">
                      Homepage highlights
                    </p>
                  </div>
                </div>

                <p className="text-xl font-black text-violet-700">
                  {featuredProducts}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <AlertTriangle size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Low Stock
                    </p>
                    <p className="text-xs text-slate-500">
                      Five units or fewer
                    </p>
                  </div>
                </div>

                <p className="text-xl font-black text-amber-700">
                  {lowStockProducts}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                    <Boxes size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Out of Stock
                    </p>
                    <p className="text-xs text-slate-500">
                      Needs restocking
                    </p>
                  </div>
                </div>

                <p className="text-xl font-black text-rose-700">
                  {outOfStockProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Common admin operations
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-emerald-100 group-hover:text-emerald-700">
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          {action.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={17}
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                <ShoppingCart size={21} />
              </div>

              <div>
                <h3 className="font-black text-slate-950">
                  Orders Module
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Order management, customer details and revenue analytics will
                  appear here after the Orders module is connected.
                </p>

                <Link
                  href="/admin/orders"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Open Orders
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

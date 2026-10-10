import type { ReactNode } from "react";
import Link from "next/link";
import {
  CircleDollarSign,
  PackageCheck,
  ShoppingCart,
  Truck,
  Warehouse,
} from "lucide-react";

import {
  formatMoney,
  formatOrderMoney,
  isMissingColumnError,
  readCurrencyCode,
  summarizeOrders,
  type CurrencyBucket,
} from "@/lib/currency";
import { getTenantCurrency } from "@/lib/tenant-currency";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function average(total: number, count: number) {
  if (count <= 0) {
    return 0;
  }

  return total / count;
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {icon}
      </div>

      <p className="mt-3 break-words text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

export default async function CurrencyReportsPage() {
  const currency = await getTenantCurrency();
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const inventoryResult = await supabase
    .from("products")
    .select("price, sale_price, stock");

  const orderColumns =
    "id, product_title, quantity, unit_price, total_amount, status, created_at";

  const ordersWithCurrency = await supabaseAdmin
    .from("orders")
    .select(`${orderColumns}, currency_code`)
    .order("created_at", { ascending: false });

  const currencyColumnMissing = isMissingColumnError(
    ordersWithCurrency.error,
    "currency_code"
  );

  const ordersResult = currencyColumnMissing
    ? await supabaseAdmin
        .from("orders")
        .select(orderColumns)
        .order("created_at", { ascending: false })
    : ordersWithCurrency;

  const orders = (ordersResult.data ?? []).map((order) => ({
    ...order,
    currency_code: readCurrencyCode(order),
  }));
  const report = summarizeOrders(orders, currency);
  const buckets =
    report.buckets.length > 0
      ? report.buckets
      : [
          {
            code: currency.code,
            locale: currency.locale,
            gross: 0,
            grossCount: 0,
            completed: 0,
            completedCount: 0,
            open: 0,
            openCount: 0,
            cancelled: 0,
            cancelledCount: 0,
          } satisfies CurrencyBucket,
        ];

  const inventoryValue = (inventoryResult.data ?? []).reduce(
    (total, product) => {
      const regularPrice = Number(product.price ?? 0);
      const salePrice = Number(product.sale_price ?? 0);
      const finalPrice = salePrice > 0 ? salePrice : regularPrice;
      const stock = Number(product.stock ?? 0);

      return total + finalPrice * stock;
    },
    0
  );

  const primary = buckets[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Currency Reports
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {currency.label}
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Catalog prices stay in {currency.code}. Each customer order
            is stored in the currency of that customer&apos;s country, and
            totals are kept separate when more than one currency appears.
          </p>
        </div>

        <Link
          href="/admin/settings"
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600"
        >
          Change Currency
        </Link>
      </div>

      {currencyColumnMissing && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">
          Orders are not storing a currency yet. Apply the currency
          migration so new orders keep the workspace currency used at
          checkout.
        </div>
      )}

      {ordersResult.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
          {ordersResult.error.message}
        </div>
      )}

      {!report.usesMultipleCurrencies ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Gross Order Value"
            value={formatMoney(primary.gross, primary.code, primary.locale)}
            detail={`Average order ${formatMoney(
              average(primary.gross, primary.grossCount),
              primary.code,
              primary.locale
            )}`}
            icon={<ShoppingCart size={22} className="text-slate-400" />}
          />
          <MetricCard
            label="Completed Revenue"
            value={formatMoney(
              primary.completed,
              primary.code,
              primary.locale
            )}
            detail={`${primary.completedCount} completed orders`}
            icon={<PackageCheck size={22} className="text-emerald-500" />}
          />
          <MetricCard
            label="Open Pipeline"
            value={formatMoney(primary.open, primary.code, primary.locale)}
            detail={`${primary.openCount} orders still in progress`}
            icon={<Truck size={22} className="text-blue-500" />}
          />
          <MetricCard
            label="Cancelled"
            value={formatMoney(
              primary.cancelled,
              primary.code,
              primary.locale
            )}
            detail={`${primary.cancelledCount} cancelled orders, excluded from gross`}
            icon={<CircleDollarSign size={22} className="text-rose-500" />}
          />
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">
              Totals by currency
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              These orders were placed under more than one workspace
              currency, so the totals stay separate.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Currency",
                    "Gross",
                    "Completed",
                    "Open",
                    "Cancelled",
                    "Average order",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buckets.map((bucket) => (
                  <tr key={bucket.code}>
                    <td className="px-6 py-4 font-black text-slate-950">
                      {bucket.code}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatMoney(bucket.gross, bucket.code, bucket.locale)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatMoney(
                        bucket.completed,
                        bucket.code,
                        bucket.locale
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatMoney(bucket.open, bucket.code, bucket.locale)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatMoney(
                        bucket.cancelled,
                        bucket.code,
                        bucket.locale
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatMoney(
                        average(bucket.gross, bucket.grossCount),
                        bucket.code,
                        bucket.locale
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>
      )}

      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <Warehouse size={20} className="text-violet-500" />
        <p className="text-sm font-bold text-slate-700">
          Inventory value in {currency.code}:{" "}
          {formatMoney(inventoryValue, currency.code, currency.locale)}
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Order amounts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Each row uses the currency saved on that order.
            </p>
          </div>

          <CircleDollarSign size={22} className="text-emerald-600" />
        </div>

        {orders.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-black text-slate-950">No orders to report</p>
            <p className="mt-2 text-sm text-slate-500">
              Currency totals will appear here after the first order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Order", "Status", "Qty", "Unit price", "Total"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-950">
                        {order.product_title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        #{String(order.id).slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold capitalize text-slate-700">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {formatOrderMoney(
                        order.unit_price,
                        readCurrencyCode(order),
                        currency
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-950">
                      {formatOrderMoney(
                        order.total_amount,
                        readCurrencyCode(order),
                        currency
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

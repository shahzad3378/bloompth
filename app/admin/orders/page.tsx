import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShoppingCart,
  Truck,
  XCircle,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { updateOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabaseAdmin = createAdminClient();

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, seller_id, product_id, product_title, quantity, unit_price, total_amount, status, created_at"
    )
    .order("created_at", { ascending: false });

  const orderList = orders || [];

  const sellerIds = [
    ...new Set(orderList.map((order) => order.seller_id)),
  ];

  const { data: sellerProfiles } =
    sellerIds.length > 0
      ? await supabaseAdmin
          .from("profiles")
          .select("id, full_name, business_name, email, phone")
          .in("id", sellerIds)
      : { data: [] };

  const sellerMap = new Map(
    (sellerProfiles || []).map((seller) => [
      seller.id,
      seller,
    ])
  );

  const pendingCount = orderList.filter(
    (order) => order.status === "pending"
  ).length;

  const processingCount = orderList.filter(
    (order) =>
      order.status === "confirmed" ||
      order.status === "processing" ||
      order.status === "shipped"
  ).length;

  const completedCount = orderList.filter(
    (order) => order.status === "completed"
  ).length;

  const totalValue = orderList
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (sum, order) =>
        sum + Number(order.total_amount || 0),
      0
    );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Order Management
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Wholesale Orders
        </h1>

        <p className="mt-2 text-slate-500">
          Review seller orders and update fulfillment status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Total Orders
            </p>

            <ShoppingCart size={22} className="text-slate-400" />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {orderList.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Pending
            </p>

            <Clock3 size={22} className="text-amber-500" />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              In Progress
            </p>

            <Truck size={22} className="text-blue-500" />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {processingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Order Value
            </p>

            <PackageCheck size={22} className="text-emerald-500" />
          </div>

          <p className="mt-3 text-2xl font-black text-slate-950">
            AED {totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error.message}
        </div>
      ) : orderList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <ShoppingCart
            className="mx-auto text-slate-400"
            size={38}
          />

          <h2 className="mt-5 text-xl font-black text-slate-950">
            No orders received yet
          </h2>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">
              Order List
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {orderList.map((order) => {
              const seller = sellerMap.get(order.seller_id);

              return (
                <div
                  key={order.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-black text-slate-950">
                          {order.product_title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                            order.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>

                      <div className="mt-4 space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-bold">Seller:</span>{" "}
                          {seller?.full_name || "Seller"}
                        </p>

                        <p>
                          <span className="font-bold">Business:</span>{" "}
                          {seller?.business_name || "Not provided"}
                        </p>

                        <p>
                          <span className="font-bold">Email:</span>{" "}
                          {seller?.email || "Not available"}
                        </p>

                        <p>
                          <span className="font-bold">Phone:</span>{" "}
                          {seller?.phone || "Not available"}
                        </p>

                        <p>
                          <span className="font-bold">Date:</span>{" "}
                          {new Date(order.created_at).toLocaleString(
                            "en-AE"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="grid min-w-0 gap-5 sm:grid-cols-3 xl:min-w-[390px]">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Quantity
                        </p>

                        <p className="mt-1 font-black text-slate-950">
                          {order.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Unit Price
                        </p>

                        <p className="mt-1 font-black text-slate-950">
                          AED {Number(order.unit_price).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Total
                        </p>

                        <p className="mt-1 font-black text-slate-950">
                          AED {Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <form
                      noValidate
                      action={updateOrderStatus}
                      className="flex flex-col gap-2 sm:flex-row xl:w-[300px]"
                    >
                      <input
                        type="hidden"
                        name="orderId"
                        value={order.id}
                      />

                      <select
                        name="status"
                        defaultValue={order.status}
                        className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        type="submit"
                        className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {completedCount > 0 && (
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={18} />
          {completedCount} completed order
          {completedCount === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}

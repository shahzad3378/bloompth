"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  product_title: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: string;
  created_at: string;
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, product_title, quantity, unit_price, total_amount, status, created_at"
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Orders load error:", error.message);
        setLoading(false);
        return;
      }

      setOrders(data || []);
      setLoading(false);
    }

    loadOrders();
  }, []);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "pending" ||
      order.status === "confirmed" ||
      order.status === "processing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
      <Link
        href="/seller"
        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Seller Orders
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          My Orders
        </h1>

        <p className="mt-2 text-slate-500">
          Track your wholesale orders and order status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Total Orders
            </p>

            <ShoppingCart className="text-slate-400" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Pending
            </p>

            <Clock3 className="text-amber-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Completed
            </p>

            <PackageCheck className="text-emerald-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {completedOrders}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            Loading orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShoppingCart size={30} />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-950">
            No orders yet
          </h2>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
            Your wholesale orders will appear here after you place an order.
          </p>

          <Link
            href="/seller/products"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-black text-white"
          >
            Browse Products
          </Link>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-black text-slate-950">
              Order History
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {order.product_title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleString("en-AE")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Qty
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

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${
                        order.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import {
  CheckCircle2,
  Clock3,
  Store,
  XCircle,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { updateSellerStatus } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  const supabaseAdmin = createAdminClient();

  const { data: sellers, error } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, full_name, business_name, phone, email, role, status, source_platform, utm_source, utm_medium, utm_campaign, fbclid, created_at"
    )
    .eq("role", "seller")
    .order("created_at", { ascending: false });

  const sellerList = sellers || [];

  const pendingCount = sellerList.filter(
    (seller) => seller.status === "pending"
  ).length;

  const activeCount = sellerList.filter(
    (seller) => seller.status === "active"
  ).length;

  const rejectedCount = sellerList.filter(
    (seller) => seller.status === "rejected"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
          Seller Verification
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Manage Sellers
        </h1>

        <p className="mt-2 text-slate-500">
          Review seller registrations before activating wholesale access.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Pending
            </p>

            <Clock3 className="text-amber-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Approved
            </p>

            <CheckCircle2 className="text-emerald-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Rejected
            </p>

            <XCircle className="text-red-500" size={22} />
          </div>

          <p className="mt-3 text-3xl font-black text-slate-950">
            {rejectedCount}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-black text-slate-950">
            Seller Applications
          </h2>
        </div>

        {error ? (
          <div className="p-6 text-red-700">
            {error.message}
          </div>
        ) : sellerList.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No seller registrations found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {sellerList.map((seller) => (
              <div
                key={seller.id}
                className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Store size={22} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-950">
                      {seller.full_name || "Unnamed Seller"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {seller.business_name || "Business name not provided"}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-slate-500">
                      <p>{seller.email || "No email"}</p>
                      <p>{seller.phone || "No phone"}</p>

                      <p>
                        <span className="font-bold text-slate-600">
                          Source:
                        </span>{" "}
                        <span className="capitalize">
                          {seller.source_platform || seller.utm_source || "direct"}
                        </span>
                      </p>

                      <p>
                        <span className="font-bold text-slate-600">
                          Campaign:
                        </span>{" "}
                        {seller.utm_campaign || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-black uppercase ${
                      seller.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : seller.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {seller.status || "pending"}
                  </span>

                  {seller.status !== "active" && (
                    <form
                      action={async () => {
                        "use server";
                        await updateSellerStatus(
                          seller.id,
                          "active"
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700"
                      >
                        <CheckCircle2 size={17} />
                        Approve
                      </button>
                    </form>
                  )}

                  {seller.status !== "rejected" && (
                    <form
                      action={async () => {
                        "use server";
                        await updateSellerStatus(
                          seller.id,
                          "rejected"
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </form>
                  )}

                  {seller.status !== "pending" && (
                    <form
                      action={async () => {
                        "use server";
                        await updateSellerStatus(
                          seller.id,
                          "pending"
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                      >
                        Reset to Pending
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

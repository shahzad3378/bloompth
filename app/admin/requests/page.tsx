import Link from "next/link";
import { MessageCircle, PackageSearch } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ProductRequest = {
  id: string;
  customer_name: string;
  company_name: string | null;
  email: string | null;
  phone: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  country: string | null;
  city: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default async function AdminRequestsPage() {
  const supabase = await createClient();

  const { data: requests, error } = await supabase
    .from("product_requests")
    .select(
      "id, customer_name, company_name, email, phone, product_id, product_name, quantity, country, city, message, status, created_at"
    )
    .order("created_at", { ascending: false });

  const typedRequests = (requests ?? []) as ProductRequest[];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
          Customer Enquiries
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Product Requests
        </h1>

        <p className="mt-2 text-slate-500">
          Review product sourcing and dropshipping enquiries submitted through
          the BloomPath website.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          Unable to load product requests: {error.message}
        </div>
      ) : typedRequests.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <PackageSearch size={30} />
          </div>

          <h2 className="mt-5 text-2xl font-black text-slate-950">
            No product requests yet
          </h2>

          <p className="mt-2 text-slate-600">
            New customer requests will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {typedRequests.map((request) => {
                  const whatsappNumber = request.phone.replace(/\D/g, "");

                  const whatsappMessage = encodeURIComponent(
                    `Hello ${request.customer_name}, this is BloomPath regarding your request for ${request.product_name}.`
                  );

                  return (
                    <tr
                      key={request.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-5 align-top">
                        <p className="font-black text-slate-950">
                          {request.customer_name}
                        </p>

                        {request.company_name && (
                          <p className="mt-1 text-sm text-slate-500">
                            {request.company_name}
                          </p>
                        )}

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                          {request.phone}
                        </p>

                        {request.email && (
                          <p className="mt-1 text-sm text-slate-500">
                            {request.email}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-5 align-top">
                        <p className="font-black text-slate-950">
                          {request.product_name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Quantity: {request.quantity}
                        </p>

                        {request.message && (
                          <p className="mt-2 max-w-xs line-clamp-2 text-sm leading-6 text-slate-500">
                            {request.message}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-5 align-top text-sm text-slate-600">
                        <p>{request.city || "—"}</p>
                        <p className="mt-1">{request.country || "—"}</p>
                      </td>

                      <td className="px-5 py-5 align-top">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                            request.status === "New"
                              ? "bg-blue-100 text-blue-700"
                              : request.status === "Contacted"
                              ? "bg-amber-100 text-amber-700"
                              : request.status === "Closed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>

                      <td className="px-5 py-5 align-top text-sm text-slate-500">
                        {new Date(request.created_at).toLocaleDateString(
                          "en-AE",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-5 py-5 align-top">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <MessageCircle size={16} />
                            WhatsApp
                          </a>

                          <Link
                            href={`/admin/requests/${request.id}`}
                            className="inline-flex items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-600"
                          >
                            View
                          </Link>
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
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import RequestStatusForm from "@/components/admin/RequestStatusForm";

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

type AdminRequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminRequestDetailPage({
  params,
}: AdminRequestDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: request, error } = await supabase
    .from("product_requests")
    .select(
      `
        id,
        customer_name,
        company_name,
        email,
        phone,
        product_id,
        product_name,
        quantity,
        country,
        city,
        message,
        status,
        created_at
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !request) {
    notFound();
  }

  const typedRequest = request as ProductRequest;

  const whatsappNumber = typedRequest.phone.replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello ${typedRequest.customer_name},

This is BloomPath regarding your product request.

Product: ${typedRequest.product_name}
Quantity: ${typedRequest.quantity}

Please let us know a suitable time to discuss the details.`
  );

  const statusClass =
    typedRequest.status === "New"
      ? "bg-blue-100 text-blue-700"
      : typedRequest.status === "Contacted"
        ? "bg-amber-100 text-amber-700"
        : typedRequest.status === "Closed"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-700";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            <ArrowLeft size={17} />
            Back to Product Requests
          </Link>

          <h1 className="mt-4 text-3xl font-black text-slate-950">
            Request Details
          </h1>

          <p className="mt-2 text-slate-500">
            Review customer information and product requirements.
          </p>
        </div>

        <span
          className={`inline-flex self-start rounded-full px-4 py-2 text-sm font-black ${statusClass}`}
        >
          {typedRequest.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <PackageSearch size={24} />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
                  Requested Product
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {typedRequest.product_name}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Quantity: {typedRequest.quantity}
                </p>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
                Additional Details
              </h3>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                {typedRequest.message || "No additional details provided."}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black text-slate-950">
              Customer Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <User size={17} />

                  <span className="text-sm font-bold">
                    Customer Name
                  </span>
                </div>

                <p className="mt-2 font-black text-slate-950">
                  {typedRequest.customer_name}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 size={17} />

                  <span className="text-sm font-bold">
                    Company
                  </span>
                </div>

                <p className="mt-2 font-black text-slate-950">
                  {typedRequest.company_name || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone size={17} />

                  <span className="text-sm font-bold">
                    Phone / WhatsApp
                  </span>
                </div>

                <p className="mt-2 font-black text-slate-950">
                  {typedRequest.phone}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail size={17} />

                  <span className="text-sm font-bold">
                    Email
                  </span>
                </div>

                <p className="mt-2 break-all font-black text-slate-950">
                  {typedRequest.email || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={17} />

                  <span className="text-sm font-bold">
                    Location
                  </span>
                </div>

                <p className="mt-2 font-black text-slate-950">
                  {[typedRequest.city, typedRequest.country]
                    .filter(Boolean)
                    .join(", ") || "Not provided"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarDays size={17} />

                  <span className="text-sm font-bold">
                    Submitted On
                  </span>
                </div>

                <p className="mt-2 font-black text-slate-950">
                  {new Date(typedRequest.created_at).toLocaleString("en-AE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <RequestStatusForm
            id={typedRequest.id}
            currentStatus={typedRequest.status}
          />

          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <h2 className="text-xl font-black">
              Contact Customer
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Use WhatsApp or email to follow up on this request.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              <MessageCircle size={18} />
              Contact on WhatsApp
            </a>

            {typedRequest.email && (
              <a
                href={`mailto:${typedRequest.email}?subject=${encodeURIComponent(
                  `BloomPath Product Request: ${typedRequest.product_name}`
                )}`}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-black text-white transition hover:bg-white/10"
              >
                <Mail size={18} />
                Send Email
              </a>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wider text-slate-500">
              Request ID
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-slate-700">
              {typedRequest.id}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
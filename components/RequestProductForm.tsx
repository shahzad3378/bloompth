"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type FormState = {
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  productName: string;
  quantity: string;
  country: string;
  city: string;
  message: string;
};

export default function RequestProductForm() {
  const searchParams = useSearchParams();

  const productFromUrl = searchParams.get("product") ?? "";
  const productId = searchParams.get("productId");

  const [form, setForm] = useState<FormState>({
    customerName: "",
    companyName: "",
    email: "",
    phone: "",
    productName: productFromUrl,
    quantity: "1",
    country: "United Arab Emirates",
    city: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setSuccess(false);
    setErrorMessage("");

    const quantity = Number(form.quantity);

    if (
      !form.customerName.trim() ||
      !form.phone.trim() ||
      !form.productName.trim()
    ) {
      setErrorMessage(
        "Please complete your name, phone number and product name."
      );
      setSubmitting(false);
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      setErrorMessage("Quantity must be at least 1.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("product_requests")
      .insert({
        customer_name: form.customerName.trim(),
        company_name: form.companyName.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        product_id: productId || null,
        product_name: form.productName.trim(),
        quantity,
        country: form.country.trim() || null,
        city: form.city.trim() || null,
        message: form.message.trim() || null,
        status: "New",
      });

    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);

    setForm({
      customerName: "",
      companyName: "",
      email: "",
      phone: "",
      productName: productFromUrl,
      quantity: "1",
      country: "United Arab Emirates",
      city: "",
      message: "",
    });
  };

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 size={30} />
        </div>

        <h2 className="mt-5 text-2xl font-black text-slate-950">
          Request submitted successfully
        </h2>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          Thank you. The BloomPath team will review your request and contact
          you using the information provided.
        </p>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-emerald-600"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <PackageSearch size={24} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">
            Product Requirement
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Complete the form and our team will contact you.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label>
          <span className="text-sm font-bold text-slate-700">
            Full Name *
          </span>

          <input
            type="text"
            value={form.customerName}
            onChange={(event) =>
              updateField("customerName", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Your full name"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Company Name
          </span>

          <input
            type="text"
            value={form.companyName}
            onChange={(event) =>
              updateField("companyName", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Your business name"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Email
          </span>

          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="name@example.com"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Phone / WhatsApp *
          </span>

          <input
            type="tel"
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="+971..."
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-slate-700">
            Product Name *
          </span>

          <input
            type="text"
            value={form.productName}
            onChange={(event) =>
              updateField("productName", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Which product do you need?"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Quantity *
          </span>

          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(event) =>
              updateField("quantity", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            Country
          </span>

          <input
            type="text"
            value={form.country}
            onChange={(event) =>
              updateField("country", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-slate-700">
            City
          </span>

          <input
            type="text"
            value={form.city}
            onChange={(event) =>
              updateField("city", event.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Dubai"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-slate-700">
            Additional Details
          </span>

          <textarea
            rows={5}
            value={form.message}
            onChange={(event) =>
              updateField("message", event.target.value)
            }
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Tell us about product specifications, target price or delivery requirements."
          />
        </label>
      </div>

      {errorMessage && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting Request
          </>
        ) : (
          <>
            Submit Product Request
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
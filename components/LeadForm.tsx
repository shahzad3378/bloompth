"use client";
import { useState, type FormEvent } from "react";
import { services } from "@/lib/service-guide";
export default function LeadForm() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setError("");
    if (!form.checkValidity()) {
      setError("Complete all fields and enter a valid email address.");
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }
    setBusy(true);
    try {
      const attribution: Record<string, string> = {};
      try {
        for (const k of [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "gclid",
        ]) {
          const v =
            new URLSearchParams(location.search).get(k) ||
            localStorage.getItem(`attribution_${k}`);
          if (v) attribution[k] = v;
        }
      } catch {}
      const r = await fetch("/api/website-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "quote", ...data, attribution }),
        signal: AbortSignal.timeout(15000),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setSuccess(true);
      window.dispatchEvent(new Event("bp-chat-refresh"));
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", "generate_lead", { service: data.service });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const input =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600";
  if (success)
    return (
      <div
        role="status"
        className="rounded-2xl border border-teal-200 bg-teal-50 p-7"
      >
        <h3 className="text-xl font-bold">Your request is with our team.</h3>
        <p className="mt-3 leading-7">
          We will review your requirements and reply by email or in the website
          chat. You can continue the conversation using the chat button.
        </p>
        <button className="mt-4 underline" onClick={() => setSuccess(false)}>
          Send another request
        </button>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={submit}
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="text-2xl font-bold">Tell us what you need</h3>
      <p className="text-sm text-slate-600">
        No payment required. The team confirms availability and pricing.
      </p>
      <label className="block text-sm font-bold">
        Service
        <select name="service" className={input}>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Your name
          <input
            name="name"
            autoComplete="name"
            maxLength={100}
            required
            className={input}
          />
        </label>
        <label className="block text-sm font-bold">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={200}
            required
            className={input}
          />
        </label>
      </div>
      <label className="block text-sm font-bold">
        Destination country
        <input
          name="country"
          autoComplete="country-name"
          maxLength={100}
          required
          className={input}
        />
      </label>
      <label className="block text-sm font-bold">
        Product, quantity & requirements
        <textarea
          name="message"
          rows={4}
          maxLength={2000}
          required
          className={input + " resize-none"}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        disabled={busy}
        className="min-h-12 w-full rounded-xl bg-blue-800 px-5 py-3 font-bold text-white hover:bg-blue-900 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Request my quote"}
      </button>
      <p className="text-xs leading-5 text-slate-500">
        We use these details to respond to your inquiry. Phone number and
        product photos are not required.
      </p>
    </form>
  );
}

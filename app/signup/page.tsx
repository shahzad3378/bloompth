"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
          phone,
          role: "seller",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setMessage(
      "Account created successfully. Please check your email and confirm your account."
    );

    setFullName("");
    setBusinessName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-emerald-600 to-slate-950 p-12 text-white lg:block">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black">
              Bloom<span className="text-emerald-300">Path</span>
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Dropshipping Marketplace
            </p>
          </Link>

          <h2 className="mt-16 text-5xl font-black leading-tight">
            Start selling without buying inventory.
          </h2>

          <p className="mt-6 text-lg leading-8 text-emerald-50">
            Create your seller account and access UAE-ready products,
            wholesale pricing and fulfillment support.
          </p>

          <div className="mt-12 space-y-4 text-sm">
            <p>✓ Ready stock in the UAE</p>
            <p>✓ Fast order processing</p>
            <p>✓ Competitive wholesale prices</p>
            <p>✓ Dedicated seller support</p>
          </div>
        </section>

        <section className="p-7 sm:p-12">
          <Link href="/" className="text-sm font-bold text-emerald-600">
            ← Back to homepage
          </Link>

          <h2 className="mt-7 text-4xl font-black text-slate-950">
            Create Seller Account
          </h2>

          <p className="mt-3 text-slate-600">
            Enter your details to register with BloomPath.
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="businessName"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Business or Store Name
              </label>

              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Enter your store name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                WhatsApp Number
              </label>

              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-slate-100 p-4 text-sm font-medium text-slate-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create Seller Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-emerald-600">
              Login here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
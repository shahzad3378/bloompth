"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SellerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setMessage(error?.message || "Unable to login.");
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setMessage("Seller profile not found.");
      setIsLoading(false);
      return;
    }

    if (profile.role !== "seller") {
      await supabase.auth.signOut();
      setMessage("This login is only for seller accounts.");
      setIsLoading(false);
      return;
    }

    if (profile.status === "rejected") {
      await supabase.auth.signOut();
      setMessage("Your seller application has been rejected.");
      setIsLoading(false);
      return;
    }

    if (profile.status === "pending") {
      router.push("/seller");
      router.refresh();
      return;
    }

    router.push("/seller");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-emerald-600 to-slate-950 p-12 text-white lg:block">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-black">
              Bloom<span className="text-emerald-300">Path</span>
            </h1>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
              Seller Center
            </p>
          </Link>

          <h2 className="mt-16 text-5xl font-black leading-tight">
            Access your seller account.
          </h2>

          <p className="mt-6 text-lg leading-8 text-emerald-50">
            Login to manage your seller account and access approved wholesale
            pricing.
          </p>
        </section>

        <section className="p-7 sm:p-12">
          <Link href="/" className="text-sm font-bold text-emerald-600">
            ← Back to homepage
          </Link>

          <h2 className="mt-7 text-4xl font-black text-slate-950">
            Seller Login
          </h2>

          <p className="mt-3 text-slate-600">
            Login with your registered seller account.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
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
              {isLoading ? "Logging in..." : "Login to Seller Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Not registered yet?{" "}
            <Link href="/signup" className="font-bold text-emerald-600">
              Create Seller Account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/seller");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-emerald-600 to-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-black">
                Bloom<span className="text-emerald-300">Path</span>
              </h1>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Dropshipping Marketplace
              </p>
            </Link>

            <h2 className="mt-16 max-w-lg text-5xl font-black leading-tight">
              Welcome back to your seller account.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-emerald-50">
              Login to manage products, track orders and grow your online
              business with BloomPath.
            </p>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <p>✓ Manage your account</p>
            <p>✓ Browse ready stock</p>
            <p>✓ Track seller orders</p>
            <p>✓ Access seller support</p>
          </div>
        </section>

        <section className="flex items-center p-7 sm:p-12">
          <div className="mx-auto w-full max-w-lg">
            <Link href="/" className="text-sm font-bold text-emerald-600">
              ← Back to homepage
            </Link>

            <h2 className="mt-7 text-4xl font-black text-slate-950">
              Seller Login
            </h2>

            <p className="mt-3 text-slate-600">
              Enter your account details to continue.
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-bold text-emerald-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {message && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
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
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-emerald-600">
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
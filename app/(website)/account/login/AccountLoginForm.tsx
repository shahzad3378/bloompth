"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AccountLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError("We couldn't sign you in. Check your email and password, then try again.");
      return;
    }
    router.replace("/products");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-[62vh] max-w-lg items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">BloomPath account</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to continue browsing and managing your BloomPath account.</p>
        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <div>
            <label htmlFor="account-email" className="mb-1.5 block text-sm font-bold text-slate-700">Email address</label>
            <input id="account-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="account-password" className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
            <input id="account-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </div>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{error}</p>}
          <button type="submit" disabled={busy || !email || !password} className="w-full cursor-pointer rounded-lg bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-600">Need a seller account? <Link href="/signup" className="font-bold text-blue-700 hover:underline">Register to sell</Link></p>
        <p className="mt-4 text-center text-xs text-slate-500">Seller sign-in is also available from the seller portal.</p>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login | BloomPath",
  description: "Login to the BloomPath administration portal.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex text-3xl font-black tracking-tight text-slate-950"
          >
            Bloom
            <span className="text-emerald-600">Path</span>
          </Link>

          <p className="mt-3 text-sm text-slate-500">
            Secure Administration Portal
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Welcome back
            </p>

            <h1 className="mt-3 text-3xl font-black text-slate-950">
              Admin Login
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Apne authorized account se BloomPath admin panel
              mein login karein.
            </p>
          </div>

          <div className="mt-8">
            <Suspense fallback={<div className="text-sm text-slate-500">Loading login...</div>}>
            <LoginForm />
          </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/"
            className="font-bold text-slate-700 hover:text-emerald-600"
          >
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type SellerProfile = {
  full_name: string | null;
  business_name: string | null;
  email: string | null;
  status: string | null;
};

export default function SellerDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadSeller() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/seller/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, business_name, email, status")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        await supabase.auth.signOut();
        router.push("/seller/login");
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    loadSeller();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/seller/login");
    router.refresh();
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/seller",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Products",
      href: "/seller/products",
      icon: PackageSearch,
    },
    {
      name: "My Orders",
      href: "/seller/orders",
      icon: ShoppingCart,
    },
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-600">
          Loading seller dashboard...
        </p>
      </main>
    );
  }

  const isApproved = profile?.status === "active";

  return (
    <main className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <Link href="/" className="block">
            <h1 className="text-2xl font-black">
              Bloom<span className="text-emerald-400">Path</span>
            </h1>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Seller Center
            </p>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                  index === 0
                    ? "bg-emerald-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Seller Dashboard
              </h2>

              <p className="hidden text-sm text-slate-500 sm:block">
                Access products and seller-only wholesale services
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-900">
              {profile?.full_name || "Seller"}
            </p>

            <p className="text-sm text-slate-500">
              {profile?.business_name || profile?.email}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <section
            className={`rounded-3xl p-7 text-white shadow-lg sm:p-10 ${
              isApproved
                ? "bg-gradient-to-r from-emerald-600 to-emerald-800"
                : "bg-gradient-to-r from-amber-500 to-orange-600"
            }`}
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  Seller Account
                </p>

                <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                  {profile?.full_name || "BloomPath Seller"}
                </h3>

                <p className="mt-3 max-w-2xl text-white/90">
                  {isApproved
                    ? "Your seller account is approved. You can now view wholesale pricing and place seller orders."
                    : "Your seller account is under verification. Wholesale pricing and ordering will unlock after approval."}
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                <p className="text-sm text-white/80">Account Status</p>

                <p className="mt-1 text-xl font-black capitalize">
                  {profile?.status || "pending"}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              href="/seller/products"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <PackageSearch className="text-emerald-600" size={28} />

              <h3 className="mt-4 text-xl font-black text-slate-950">
                Browse Products
              </h3>

              <p className="mt-2 text-slate-600">
                Explore products available for wholesale sourcing and fulfillment.
              </p>
            </Link>

            <Link
              href="/seller/orders"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <ShoppingCart className="text-emerald-600" size={28} />

              <h3 className="mt-4 text-xl font-black text-slate-950">
                My Orders
              </h3>

              <p className="mt-2 text-slate-600">
                Review your submitted wholesale orders and their status.
              </p>
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Wholesale Access
                </h3>

                <p className="mt-2 text-slate-600">
                  {isApproved
                    ? "Your account is verified and eligible for wholesale pricing and order placement."
                    : "Wholesale pricing and order placement remain locked until your seller account is approved."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

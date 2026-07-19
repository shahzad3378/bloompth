"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
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
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, business_name, email, status")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile error:", error.message);
      }

      setProfile(
        data || {
          full_name: user.user_metadata?.full_name || "Seller",
          business_name: user.user_metadata?.business_name || "",
          email: user.email || "",
          status: "pending",
        }
      );

      setLoading(false);
    }

    loadSeller();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/seller",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/seller/products",
      icon: Package,
    },
    {
      name: "Add Product",
      href: "/seller/products/add",
      icon: PlusCircle,
    },
    {
      name: "Orders",
      href: "/seller/orders",
      icon: ShoppingCart,
    },
    {
      name: "Settings",
      href: "/seller/settings",
      icon: Settings,
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
                Manage your BloomPath seller account
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
          <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 p-7 text-white shadow-lg sm:p-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-100">
                  Welcome back
                </p>

                <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                  {profile?.full_name || "BloomPath Seller"}
                </h3>

                <p className="mt-3 max-w-2xl text-emerald-50">
                  Manage your products, orders and seller account from one
                  dashboard.
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                <p className="text-sm text-emerald-100">Account Status</p>

                <p className="mt-1 text-xl font-black capitalize">
                  {profile?.status || "pending"}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard title="Total Products" value="0" label="Products" />
            <DashboardCard title="Total Orders" value="0" label="Orders" />
            <DashboardCard title="Pending Orders" value="0" label="Pending" />
            <DashboardCard title="Total Revenue" value="AED 0" label="Revenue" />
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    Recent Orders
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest customer orders will appear here.
                  </p>
                </div>

                <Link
                  href="/seller/orders"
                  className="text-sm font-bold text-emerald-600"
                >
                  View all
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 px-5 py-14 text-center">
                <ShoppingCart
                  size={38}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-4 font-bold text-slate-700">No orders yet</p>

                <p className="mt-1 text-sm text-slate-500">
                  Customer orders will appear after products go live.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-950">
                Quick Actions
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Start managing your seller account.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/seller/products/add"
                  className="flex items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white transition hover:bg-emerald-500"
                >
                  <PlusCircle size={20} />
                  Add New Product
                </Link>

                <Link
                  href="/seller/products"
                  className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  <Package size={20} />
                  Manage Products
                </Link>

                <Link
                  href="/seller/settings"
                  className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  <Settings size={20} />
                  Account Settings
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  label,
}: {
  title: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>

      <p className="mt-4 text-3xl font-black text-slate-950">{value}</p>

      <p className="mt-2 text-sm text-emerald-600">{label}</p>
    </div>
  );
}
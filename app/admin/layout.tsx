import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeaderActions from "@/components/admin/AdminHeaderActions";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email || "admin@bloompath.com";

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <AdminSidebar userEmail={userEmail} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h1 className="text-sm font-bold text-slate-950 sm:text-base">
                BloomPath Administration
              </h1>

              <p className="mt-1 hidden text-xs text-slate-500 sm:block">
                Manage products, users and website settings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden w-60 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">
                <Search size={18} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search admin..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <AdminHeaderActions userEmail={userEmail} />
            </div>
          </div>
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
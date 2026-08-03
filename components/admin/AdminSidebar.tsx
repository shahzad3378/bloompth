"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";

type AdminSidebarProps = {
  userEmail: string;
};

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Product Requests",
    href: "/admin/requests",
    icon: MessageSquareText,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  userEmail,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-24 items-center justify-between border-b border-white/10 px-5 py-4">
          <Link
            href="/admin"
            onClick={closeMobileSidebar}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1">
              <Image
                src="/images/logo.png"
                alt="BloomPath logo"
                width={56}
                height={56}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xl font-black tracking-tight">
                Bloom<span className="text-emerald-400">Path</span>
              </p>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Admin Panel
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            Management
          </p>

          <div className="space-y-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileSidebar}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-black transition ${
                    active
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/15"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 2}
                    />

                    {link.name}
                  </span>

                  <ChevronRight
                    size={17}
                    className={`transition-transform ${
                      active
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              Signed in as
            </p>

            <p className="mt-2 truncate text-sm font-bold text-slate-200">
              {userEmail}
            </p>

            <Link
              href="/"
              onClick={closeMobileSidebar}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
            >
              View Website
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
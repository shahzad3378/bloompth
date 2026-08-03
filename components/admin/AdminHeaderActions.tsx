"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type AdminHeaderActionsProps = {
  userEmail: string;
};

export default function AdminHeaderActions({
  userEmail,
}: AdminHeaderActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const initial = userEmail.charAt(0).toUpperCase() || "A";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <div ref={menuRef} className="relative flex items-center gap-3">
      <div className="relative">
        <button
          type="button"
          aria-label="Notifications"
          aria-expanded={notificationOpen}
          onClick={() => {
            setNotificationOpen((current) => !current);
            setMenuOpen(false);
          }}
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {notificationOpen && (
          <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-4">
              <h3 className="font-bold text-slate-950">
                Notifications
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Admin updates and alerts
              </p>
            </div>

            <div className="px-4 py-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Bell size={20} />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-800">
                No new notifications
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                New product requests and system updates will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Open admin profile menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((current) => !current);
            setNotificationOpen(false);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200"
        >
          {initial}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Signed in as
              </p>

              <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                {userEmail}
              </p>
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/admin/users");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <UserRound size={18} />
                Users
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/admin/settings");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <Settings size={18} />
                Settings
              </button>

              <div className="my-2 border-t border-slate-100" />

              <button
                type="button"
                disabled={loggingOut}
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={18} />

                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
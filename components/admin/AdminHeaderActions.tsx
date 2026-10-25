"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type AdminHeaderActionsProps = {
  userEmail: string;
  newRequestCount: number;
};

export default function AdminHeaderActions({
  userEmail,
  newRequestCount,
}: AdminHeaderActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const menuRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [newChatCount, setNewChatCount] = useState(0);
  const [chatAlert, setChatAlert] = useState("");
  const chatSnapshotRef = useRef<Record<string, string>>({});
  const hasChatSnapshotRef = useRef(false);

  const initial = userEmail.charAt(0).toUpperCase() || "A";

  useEffect(() => {
    let active = true;

    async function refreshChatNotifications() {
      try {
        const response = await fetch("/api/admin/chat", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as {
          conversations: Array<{
            id: string;
            customer_name: string;
            last_sender_role: "customer" | "team" | null;
            unread_for_team: boolean;
            updated_at: string;
          }>;
        };
        if (!active) return;

        const unreadChats = (data.conversations ?? []).filter(
          (chat) => chat.unread_for_team && chat.last_sender_role === "customer"
        );
        setNewChatCount(unreadChats.length);

        const newestIncoming = unreadChats
          .filter((chat) => chatSnapshotRef.current[chat.id] !== chat.updated_at)
          .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];

        if (hasChatSnapshotRef.current && newestIncoming) {
          setChatAlert(newestIncoming.customer_name);
        }

        chatSnapshotRef.current = Object.fromEntries(
          unreadChats.map((chat) => [chat.id, chat.updated_at])
        );
        hasChatSnapshotRef.current = true;
      } catch {
        // The next poll retries if a request briefly fails.
      }
    }

    const initial = window.setTimeout(() => void refreshChatNotifications(), 0);
    const timer = window.setInterval(() => void refreshChatNotifications(), 7000);
    return () => {
      active = false;
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);


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

          {newRequestCount + newChatCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white ring-2 ring-white">{newRequestCount + newChatCount > 9 ? "9+" : newRequestCount + newChatCount}</span> : <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-slate-300 ring-2 ring-white" />}
        </button>

        {notificationOpen && (
          <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-4">
              <h3 className="font-bold text-slate-950">
                Notifications
              </h3>

              <p className="mt-1 text-xs text-slate-500">Customer requests and admin alerts</p>
            </div>

            <div className="space-y-3 p-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{newRequestCount ? `${newRequestCount} new product ${newRequestCount === 1 ? "request" : "requests"}` : "No new product requests"}</p>
                <Link href="/admin/requests" onClick={() => setNotificationOpen(false)} className="mt-2 inline-flex rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">View product requests</Link>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{newChatCount ? `${newChatCount} customer ${newChatCount === 1 ? "chat needs" : "chats need"} a reply` : "No new customer chats"}</p>
                <Link href="/admin/chats" onClick={() => setNotificationOpen(false)} className="mt-2 inline-flex rounded-lg bg-blue-800 px-3 py-2 text-xs font-bold text-white hover:bg-blue-900">Open Live Chat</Link>
              </div>
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
      {chatAlert && <Link href="/admin/chats" onClick={() => setChatAlert("")} role="status" aria-live="polite" className="fixed right-5 top-20 z-[100] max-w-[calc(100vw-2.5rem)] rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white shadow-xl">New customer message from {chatAlert} · Open Live Chat</Link>}
    </div>
  );
}

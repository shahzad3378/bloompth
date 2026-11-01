"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export default function ConversationReply({ id }: { id: string }) {
  const router = useRouter();
  const [body, setBody] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function send(action: string) {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/admin/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, body, action }),
        signal: AbortSignal.timeout(15000),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setBody("");
      setMessage(
        action === "resolve"
          ? "Conversation resolved."
          : "Reply saved. The visitor can read it in the website chat.",
      );
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      noValidate
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        void send("reply");
      }}
      className="mt-4 space-y-3"
    >
      <label className="block text-sm font-bold">
        Reply to visitor
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={2000}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 p-3"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          disabled={busy || !body.trim()}
          className="rounded-xl bg-blue-800 px-4 py-3 font-bold text-white disabled:opacity-50"
        >
          Send reply
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void send("resolve")}
          className="rounded-xl border border-slate-300 px-4 py-3"
        >
          Mark resolved
        </button>
      </div>
      <p role="status" className="text-sm">
        {message}
      </p>
    </form>
  );
}

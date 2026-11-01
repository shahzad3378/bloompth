"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";
type Message = { id: string; role: string; body: string };
export default function WebsiteChat() {
  const [open, setOpen] = useState(false),
    [messages, setMessages] = useState<Message[]>([]),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const end = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  async function refresh(signal?: AbortSignal) {
    try {
      const r = await fetch("/api/website-chat", {
        cache: "no-store",
        signal: signal ?? AbortSignal.timeout(12000),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setMessages(d.messages ?? []);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setError("Chat could not refresh. Try again or visit Contact.");
    }
  }
  useEffect(() => {
    if (!open) return;
    const c = new AbortController();
    input.current?.focus();
    const timer = setInterval(() => {
      if (!document.hidden) void refresh(c.signal);
    }, 10000);
    const f = () => void refresh(c.signal);
    window.addEventListener("bp-chat-refresh", f);
    return () => {
      c.abort();
      clearInterval(timer);
      window.removeEventListener("bp-chat-refresh", f);
    };
  }, [open]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);
  async function send(kind = "message") {
    if (busy || (kind === "message" && !text.trim())) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/website-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, message: text }),
        signal: AbortSignal.timeout(15000),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setText("");
      await refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Message could not be confirmed. Retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div className="fixed bottom-5 right-4 z-[70] sm:right-6">
      {open && (
        <section
          aria-label="BloomPath chat"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          className="mb-3 flex h-[min(560px,75dvh)] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-blue-900 px-5 py-4 text-white">
            <div>
              <h2 className="font-bold">Chat with BloomPath</h2>
              <p className="mt-1 text-xs text-blue-100">
                Automated guide + team follow-up
              </p>
            </div>
            <button
              aria-label="Close chat"
              onClick={close}
              className="rounded-lg p-2 hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </header>
          <div
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            <p className="rounded-xl bg-slate-100 p-3 text-sm leading-6">
              Hello! Ask about sourcing, wholesale or fulfillment. No phone
              number needed. Messages are saved so our team can follow up in
              this chat.
            </p>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[95%] whitespace-pre-wrap rounded-xl p-3 text-sm leading-6 ${m.role === "visitor" ? "ml-auto bg-blue-800 text-white" : "bg-slate-100 text-slate-800"}`}
              >
                <span className="mb-1 block text-[11px] font-bold">
                  {m.role === "visitor"
                    ? "You"
                    : m.role === "team"
                      ? "BloomPath team"
                      : "Automated guide"}
                </span>
                {m.body}
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="border-t border-slate-200 p-3">
            {error && (
              <p role="alert" className="mb-2 text-xs text-red-700">
                {error}{" "}
                <button
                  onClick={() => {
                    setError("");
                    void refresh();
                  }}
                  className="underline"
                >
                  Retry
                </button>
              </p>
            )}
            <form
              noValidate
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                void send();
              }}
              className="flex gap-2"
            >
              <label htmlFor="bp-chat-text" className="sr-only">
                Your message
              </label>
              <input
                ref={input}
                id="bp-chat-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={2000}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
              <button
                aria-label="Send message"
                disabled={busy || !text.trim()}
                className="rounded-xl bg-blue-800 px-4 text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="mt-3 flex justify-between text-xs">
              <button
                disabled={busy}
                onClick={() => void send("handoff")}
                className="font-bold text-blue-800 underline"
              >
                Ask the team
              </button>
              <a href="/contact" className="text-slate-600 underline">
                Contact options
              </a>
            </div>
          </div>
        </section>
      )}
      <button
        ref={trigger}
        onClick={() => {
          if (open) close();
          else {
            setOpen(true);
            void refresh();
          }
        }}
        aria-expanded={open}
        className="ml-auto flex min-h-12 items-center gap-2 rounded-full bg-blue-800 px-5 py-3 font-bold text-white shadow-lg hover:bg-blue-900"
      >
        <MessageCircle size={21} />
        {open ? "Close chat" : "Need help? Chat"}
      </button>
    </div>
  );
}

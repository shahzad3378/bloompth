"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LoaderCircle, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = { id: string; sender_role: "customer" | "team"; body: string; created_at: string };
type ChatSession = { id: string; visitorToken: string; name: string; email: string };
const storageKey = "bloompath-support-chat-v1";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refreshMessages = useCallback(async (active: ChatSession) => {
    try {
      const response = await fetch(`/api/support/conversations/${active.id}`, { headers: { "x-chat-token": active.visitorToken }, cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json() as { messages: ChatMessage[] };
      setMessages(data.messages ?? []);
    } catch {
      // Keep the chat usable if a polling request briefly fails.
    }
  }, []);

  useEffect(() => {
    if (!open || !session) return;
    const initial = window.setTimeout(() => void refreshMessages(session), 0);
    const timer = window.setInterval(() => void refreshMessages(session), 5000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [open, session, refreshMessages]);

  const startChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError("");
    const visitorToken = crypto.randomUUID() + crypto.randomUUID();
    try {
      const response = await fetch("/api/support/conversations", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitorToken, name, email, message: firstMessage, pageUrl: `${window.location.origin}${window.location.pathname}` }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chat could not be started.");
      const next = { id: data.id as string, visitorToken, name: name.trim(), email: email.trim() };
      localStorage.setItem(storageKey, JSON.stringify(next));
      setSession(next); setFirstMessage("");
      await refreshMessages(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally { setBusy(false); }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !draft.trim()) return;
    const body = draft.trim(); setDraft(""); setBusy(true); setError("");
    try {
      const response = await fetch(`/api/support/conversations/${session.id}/messages`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ visitorToken: session.visitorToken, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Message could not be sent.");
      await refreshMessages(session);
    } catch (cause) {
      setDraft(body);
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
      {open && <section aria-label="BloomPath customer support chat" className="mb-3 flex h-[min(70dvh,560px)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-blue-950 px-4 py-3 text-white">
          <div><p className="font-black">Chat with BloomPath</p><p className="text-xs text-blue-100">Our team will reply here</p></div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg p-2 hover:bg-white/10"><X size={18}/></button>
        </header>
        {!session ? <form onSubmit={startChat} className="flex flex-1 flex-col gap-3 p-4">
          <label className="text-xs font-bold text-slate-700">Your name<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name"/></label>
          <label className="text-xs font-bold text-slate-700">Email <span className="font-normal text-slate-400">(optional)</span><input type="email" maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"/></label>
          <label className="flex flex-1 flex-col text-xs font-bold text-slate-700">How can we help?<textarea required maxLength={2000} value={firstMessage} onChange={e=>setFirstMessage(e.target.value)} className="mt-1 min-h-24 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Write your message..."/></label>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-black text-white disabled:opacity-60">{busy&&<LoaderCircle className="animate-spin" size={16}/>}Start chat</button>
        </form> : <>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map(message=><div key={message.id} className={`flex ${message.sender_role==="customer"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.sender_role==="customer"?"bg-blue-700 text-white":"border border-slate-200 bg-white text-slate-800"}`}><p className="whitespace-pre-wrap break-words">{message.body}</p><time className={`mt-1 block text-[10px] ${message.sender_role==="customer"?"text-blue-100":"text-slate-400"}`}>{new Date(message.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</time></div></div>)}
            {messages.length===0&&<p className="text-center text-sm text-slate-500">Your chat is ready. Send us a message.</p>}
          </div>
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold text-slate-600">Need a person to help? Contact the team directly:</p>
            <div className="mt-2 flex gap-2">
              <a href="https://wa.me/971507297900" target="_blank" rel="noopener noreferrer" className="flex-1 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-800 hover:bg-emerald-100">WhatsApp</a>
              <a href="mailto:bloompathsms@gmail.com" className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-center text-xs font-bold text-blue-800 hover:bg-blue-100">Email</a>
            </div>
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-3"><div className="flex items-end gap-2"><textarea aria-label="Message" rows={1} maxLength={2000} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();e.currentTarget.form?.requestSubmit()}}} className="max-h-28 min-h-10 flex-1 resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type a message..."/><button aria-label="Send message" disabled={busy||!draft.trim()} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white disabled:opacity-50"><Send size={17}/></button></div>{error&&<p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}</form>
        </>}
      </section>}
      <button onClick={()=>{if(!open&&!session){try{const saved=localStorage.getItem(storageKey);if(saved)setSession(JSON.parse(saved) as ChatSession);}catch{localStorage.removeItem(storageKey);}}setOpen(value=>!value);}} aria-label={open?"Close support chat":"Chat with BloomPath"} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-white shadow-xl transition hover:bg-blue-900"><MessageCircle size={25}/></button>
    </div>
  );
}

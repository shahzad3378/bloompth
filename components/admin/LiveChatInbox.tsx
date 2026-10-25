"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, MessageCircle, Send } from "lucide-react";

type Conversation = { id: string; customer_name: string; customer_email: string | null; page_url: string | null; status: "open" | "closed"; last_message: string | null; last_sender_role: "customer" | "team" | null; unread_for_team: boolean; created_at: string; updated_at: string };
type ChatMessage = { id: string; sender_role: "customer" | "team"; body: string; created_at: string };

export default function LiveChatInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refreshList = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/chat", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load the inbox.");
      const data = await response.json() as { conversations: Conversation[] };
      setConversations(data.conversations ?? []);
      setSelected(current => current ? (data.conversations ?? []).find(item => item.id === current.id) ?? current : null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load the inbox."); }
  }, []);

  const refreshConversation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/admin/chat/${id}`, { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json() as { conversation: Conversation; messages: ChatMessage[] };
      setSelected(data.conversation); setMessages(data.messages ?? []);
    } catch { /* polling retries on its next tick */ }
  }, []);

  useEffect(() => { const initial=window.setTimeout(()=>void refreshList(),0); const timer=window.setInterval(()=>void refreshList(),7000); return()=>{window.clearTimeout(initial);window.clearInterval(timer);}; }, [refreshList]);
  const selectedId=selected?.id;
  useEffect(() => { if (!selectedId) return; const initial=window.setTimeout(()=>void refreshConversation(selectedId),0); const timer=window.setInterval(()=>void refreshConversation(selectedId),5000); return()=>{window.clearTimeout(initial);window.clearInterval(timer);}; }, [selectedId, refreshConversation]);

  const sendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!selected || !draft.trim()) return;
    setBusy(true); setError("");
    try {
      const response=await fetch(`/api/admin/chat/${selected.id}/messages`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({body:draft.trim()})});
      const data=await response.json(); if(!response.ok)throw new Error(data.error||"Reply could not be sent.");
      setDraft(""); await refreshConversation(selected.id); await refreshList();
    } catch(cause){setError(cause instanceof Error?cause.message:"Reply could not be sent.");}
    finally{setBusy(false);}
  };

  const setStatus = async () => {
    if(!selected)return; const status=selected.status==="open"?"closed":"open";
    const response=await fetch(`/api/admin/chat/${selected.id}/status`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({status})});
    if(response.ok){await refreshConversation(selected.id);await refreshList();}
  };

  return <div className="mx-auto max-w-7xl space-y-5">
    <div><p className="text-sm font-black uppercase tracking-widest text-blue-700">Customer support</p><h1 className="mt-2 text-3xl font-black text-slate-950">Live Chat</h1><p className="mt-2 text-slate-500">Reply to messages customers send from the BloomPath website.</p></div>
    <div className="grid min-h-[min(72vh,760px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><span className="font-black text-slate-900">Inbox</span><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{conversations.filter(item=>item.unread_for_team).length} new</span></div>
        <div className="max-h-[35vh] overflow-y-auto lg:max-h-[min(68vh,680px)]">{conversations.length===0?<p className="p-5 text-sm text-slate-500">No customer chats yet.</p>:conversations.map(item=><button key={item.id} onClick={()=>{setSelected(item);void refreshConversation(item.id);}} className={`w-full border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${selected?.id===item.id?"bg-blue-50":""}`}><span className="flex items-center justify-between gap-2"><span className="truncate font-bold text-slate-900">{item.customer_name}</span><span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${item.status==="open"?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-500"}`}>{item.status}</span></span><span className="mt-1 block truncate text-xs text-slate-500">{item.last_message||"Started a chat"}</span><span className="mt-2 flex items-center justify-between text-[10px] text-slate-400"><span>{new Date(item.updated_at).toLocaleString()}</span>{item.unread_for_team&&<span className="h-2 w-2 rounded-full bg-blue-600"/>}</span></button>)}</div>
      </aside>
      <section className="flex min-h-[420px] flex-col">
        {!selected?<div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400"><MessageCircle size={34}/><p className="mt-3 font-semibold">Select a customer chat</p></div>:<>
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6"><div className="min-w-0"><h2 className="truncate font-black text-slate-950">{selected.customer_name}</h2><p className="truncate text-xs text-slate-500">{selected.customer_email||"No email provided"}{selected.page_url?` · ${(() => { try { return new URL(selected.page_url).pathname; } catch { return "Website"; } })()}`:""}</p></div><button onClick={()=>void setStatus()} className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">{selected.status==="open"?<><Check size={14}/> Close chat</>:"Reopen"}</button></header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 sm:p-6" aria-live="polite">{messages.map(message=><div key={message.id} className={`flex ${message.sender_role==="team"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.sender_role==="team"?"bg-blue-800 text-white":"border border-slate-200 bg-white text-slate-800"}`}><p className="whitespace-pre-wrap break-words">{message.body}</p><time className={`mt-1 block text-[10px] ${message.sender_role==="team"?"text-blue-100":"text-slate-400"}`}>{new Date(message.created_at).toLocaleString()}</time></div></div>)}</div>
          <form onSubmit={sendReply} className="border-t border-slate-200 p-3 sm:p-4"><div className="flex items-end gap-2"><textarea aria-label="Reply to customer" rows={2} maxLength={2000} value={draft} onChange={e=>setDraft(e.target.value)} className="max-h-36 min-h-11 flex-1 resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Write your reply..."/><button disabled={busy||!draft.trim()} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white disabled:opacity-50"><Send size={18}/></button></div>{error&&<p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}{busy&&<span className="sr-only"><LoaderCircle className="animate-spin"/></span>}</form>
        </>}
      </section>
    </div>
  </div>;
}

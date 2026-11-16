"use client";
import { useState } from "react";
export default function TelegramSetup() {
 const [busy,setBusy]=useState(false);
 const [result,setResult]=useState("");
 async function connect() {
   setBusy(true); setResult("");
   try {
     const response=await fetch("/api/admin/telegram-setup",{method:"POST",headers:{"Content-Type":"application/json"}});
     const data=await response.json();
     setResult(response.ok ? data.message : data.error ?? "Setup failed");
   } catch { setResult("Could not connect. Retry."); }
   finally { setBusy(false); }
 }
 return <div className="rounded-xl border border-slate-200 bg-white p-4">
   <p className="font-bold">Telegram support bot</p>
   <p className="mt-1 text-sm text-slate-600">After adding Telegram environment variables and deploying, register your webhook securely. No bot token is shown here.</p>
   <button type="button" onClick={connect} disabled={busy} className="mt-3 rounded-lg bg-blue-800 px-4 py-2 font-bold text-white disabled:opacity-50">{busy?"Connecting...":"Connect Telegram bot"}</button>
   {result && <p role="status" className="mt-2 text-sm">{result}</p>}
 </div>;
}

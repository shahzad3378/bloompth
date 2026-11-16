import { createAdminClient } from "@/lib/supabase/admin";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-telegram-bot-api-secret-token") !== secret)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const allowed = process.env.TELEGRAM_CHAT_ID;
  if (!token || !allowed) return Response.json({ error: "Not configured" }, { status: 503 });
  try {
    const update = await request.json();
    const msg = update.message;
    if (!msg?.text || String(msg.chat?.id) !== allowed) return Response.json({ ok: true });
    const db = createAdminClient();
    const input = String(msg.text).trim();
    let conversationId: string | undefined;
    let body: string;
    const explicit = input.match(/^\/reply(?:@\w+)?\s+([0-9a-f-]{36})\s+([\s\S]+)/i);
    if (explicit) {
      conversationId = explicit[1]; body = explicit[2].trim();
    } else if (msg.reply_to_message?.message_id) {
      const { data, error } = await db.from("website_telegram_links")
        .select("conversation_id").eq("telegram_message_id", msg.reply_to_message.message_id).maybeSingle();
      if (error) throw error;
      conversationId = data?.conversation_id;
      body = input;
    } else {
      return Response.json({ ok: true });
    }
    if (!conversationId || !body || body.length > 2000) return Response.json({ ok: true });
    const { data: conversation, error: lookupError } = await db.from("website_conversations")
      .select("id").eq("id", conversationId).maybeSingle();
    if (lookupError) throw lookupError;
    if (!conversation) return Response.json({ ok: true });
    // Telegram retries updates: deduplicate by update ID.
    const { data: inserted, error: dedupeError } = await db.from("website_telegram_updates")
      .upsert({ update_id: update.update_id }, { onConflict: "update_id", ignoreDuplicates: true })
      .select("update_id");
    if (dedupeError) throw dedupeError;
    if (!inserted?.length) return Response.json({ ok: true });
    const { error } = await db.from("website_messages").insert({ conversation_id: conversationId, role: "team", body });
    if (error) throw error;
    const { error: updateError } = await db.from("website_conversations")
      .update({ status: "waiting", updated_at: new Date().toISOString() }).eq("id", conversationId);
    if (updateError) throw updateError;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook processing failed", error);
    return Response.json({ error: "Retry" }, { status: 503 });
  }
}

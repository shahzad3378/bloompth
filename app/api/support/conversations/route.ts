import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const token = clean(payload?.visitorToken, 200);
  const name = clean(payload?.name, 120);
  const email = clean(payload?.email, 254).toLowerCase();
  const pageUrl = clean(payload?.pageUrl, 500);
  const firstMessage = clean(payload?.message, 2000);

  if (token.length < 20 || !name || !firstMessage) {
    return NextResponse.json({ error: "Name and message are required." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  let safePageUrl: string | null = null;
  try {
    const parsed = new URL(pageUrl);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") safePageUrl = parsed.toString();
  } catch { /* page URL is optional metadata */ }

  const supabase = createAdminClient();
  const { data: conversation, error: conversationError } = await supabase
    .from("support_conversations")
    .insert({ visitor_token_hash: hashToken(token), customer_name: name, customer_email: email || null, page_url: safePageUrl, last_message: firstMessage, last_sender_role: "customer", unread_for_team: true })
    .select("id")
    .single();

  if (conversationError || !conversation) {
    return NextResponse.json({ error: "Could not start the chat. Please try again." }, { status: 500 });
  }

  const messageTime = new Date();
  const { error: messageError } = await supabase.from("support_messages").insert([
    { conversation_id: conversation.id, sender_role: "customer", body: firstMessage, created_at: messageTime.toISOString() },
    {
      conversation_id: conversation.id,
      sender_role: "team",
      body: "Thanks for contacting BloomPath. We’ve received your message. Our team will reply here. If you need a human right away, use the WhatsApp or email options below.",
      created_at: new Date(messageTime.getTime() + 1).toISOString(),
    },
  ]);
  if (messageError) {
    await supabase.from("support_conversations").delete().eq("id", conversation.id);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ id: conversation.id });
}

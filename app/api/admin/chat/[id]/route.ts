import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAccount, isActiveAdmin } from "@/lib/auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function GET(_request: Request, { params }: Context) {
  const account = await getCurrentAccount();
  if (!isActiveAdmin(account)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  if (!validId(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const supabase = createAdminClient();
  const [{ data: conversation, error: conversationError }, { data: messages, error: messagesError }] = await Promise.all([
    supabase.from("support_conversations").select("id, customer_name, customer_email, page_url, status, last_message, created_at, updated_at").eq("id", id).maybeSingle(),
    supabase.from("support_messages").select("id, sender_role, body, created_at").eq("conversation_id", id).order("created_at", { ascending: true }),
  ]);
  if (conversationError || messagesError) return NextResponse.json({ error: "Could not load this chat." }, { status: 500 });
  if (!conversation) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await supabase.from("support_conversations").update({ unread_for_team: false }).eq("id", id);
  return NextResponse.json({ conversation, messages: messages ?? [] });
}

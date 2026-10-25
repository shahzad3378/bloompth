import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  const token = request.headers.get("x-chat-token") || "";
  if (!validId(id) || token.length < 20) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const supabase = createAdminClient();
  const { data: conversation } = await supabase.from("support_conversations").select("id, status, visitor_token_hash").eq("id", id).maybeSingle();
  if (!conversation || conversation.visitor_token_hash !== hashToken(token)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { data: messages, error } = await supabase.from("support_messages").select("id, sender_role, body, created_at").eq("conversation_id", id).order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: "Could not load messages." }, { status: 500 });
  return NextResponse.json({ status: conversation.status, messages: messages ?? [] });
}

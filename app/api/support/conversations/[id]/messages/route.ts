import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const token = typeof payload?.visitorToken === "string" ? payload.visitorToken.slice(0, 200) : "";
  const body = typeof payload?.body === "string" ? payload.body.trim().slice(0, 2000) : "";
  if (!validId(id) || token.length < 20 || !body) return NextResponse.json({ error: "A message is required." }, { status: 400 });

  const supabase = createAdminClient();
  const { data: conversation } = await supabase.from("support_conversations").select("id, visitor_token_hash").eq("id", id).maybeSingle();
  if (!conversation || conversation.visitor_token_hash !== hashToken(token)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { error: messageError } = await supabase.from("support_messages").insert({ conversation_id: id, sender_role: "customer", body });
  if (messageError) return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  const { error: updateError } = await supabase.from("support_conversations").update({ last_message: body, last_sender_role: "customer", unread_for_team: true, status: "open", updated_at: new Date().toISOString() }).eq("id", id);
  if (updateError) return NextResponse.json({ error: "Message sent, but chat status did not update." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

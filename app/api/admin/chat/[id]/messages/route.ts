import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAccount, isActiveAdmin } from "@/lib/auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function POST(request: Request, { params }: Context) {
  const account = await getCurrentAccount();
  if (!account || !isActiveAdmin(account)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const body = typeof payload?.body === "string" ? payload.body.trim().slice(0, 2000) : "";
  if (!validId(id) || !body) return NextResponse.json({ error: "A message is required." }, { status: 400 });

  const supabase = createAdminClient();
  const { error: messageError } = await supabase.from("support_messages").insert({ conversation_id: id, sender_role: "team", sender_id: account.userId, body });
  if (messageError) return NextResponse.json({ error: "Could not send your reply." }, { status: 500 });
  const { error: updateError } = await supabase.from("support_conversations").update({ last_message: body, last_sender_role: "team", unread_for_team: false, status: "open", updated_at: new Date().toISOString() }).eq("id", id);
  if (updateError) return NextResponse.json({ error: "Reply sent, but chat status did not update." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

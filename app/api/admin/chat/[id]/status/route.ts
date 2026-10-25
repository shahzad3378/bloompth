import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAccount, isActiveAdmin } from "@/lib/auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const validId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function POST(request: Request, { params }: Context) {
  const account = await getCurrentAccount();
  if (!isActiveAdmin(account)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const status = payload?.status;
  if (!validId(id) || !["open", "closed"].includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const supabase = createAdminClient();
  const { error } = await supabase.from("support_conversations").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update chat status." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

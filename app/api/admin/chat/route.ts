import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAccount, isActiveAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const account = await getCurrentAccount();
  if (!isActiveAdmin(account)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("support_conversations")
    .select("id, customer_name, customer_email, page_url, status, last_message, last_sender_role, unread_for_team, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: "Could not load chats." }, { status: 500 });
  return NextResponse.json({ conversations: data ?? [] });
}

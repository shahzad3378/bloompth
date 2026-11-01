import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const b = await request.json();
    if (typeof b.id !== "string" || !/^[-a-f0-9]{36}$/.test(b.id))
      return Response.json({ error: "Invalid conversation" }, { status: 400 });
    const db = await createClient();
    const body = typeof b.body === "string" ? b.body.trim() : "";
    if (b.action !== "resolve" && (!body || body.length > 2000))
      return Response.json(
        { error: "Enter a reply up to 2,000 characters" },
        { status: 400 },
      );
    if (b.action !== "resolve") {
      const { error } = await db
        .from("website_messages")
        .insert({ conversation_id: b.id, role: "team", body });
      if (error) throw error;
    }
    const { error } = await db
      .from("website_conversations")
      .update({
        status: b.action === "resolve" ? "resolved" : "waiting",
        updated_at: new Date().toISOString(),
      })
      .eq("id", b.id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Reply could not be saved. Retry." },
      { status: 503 },
    );
  }
}

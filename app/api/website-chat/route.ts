import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { serviceAnswer, services } from "@/lib/service-guide";
export const dynamic = "force-dynamic";
const reply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function session(create: boolean) {
  const jar = await cookies();
  let token = jar.get("bp_visitor")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (!create) return null;
    token = randomBytes(32).toString("hex");
    jar.set("bp_visitor", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 2592000,
    });
  }
  return createHash("sha256").update(token).digest("hex");
}
export async function GET() {
  try {
    const key = await session(false);
    if (!key) return reply({ messages: [], status: "open" });
    const db = createAdminClient();
    const { data: c, error } = await db
      .from("website_conversations")
      .select("id,status")
      .eq("visitor_key", key)
      .maybeSingle();
    if (error) throw error;
    if (!c) return reply({ messages: [], status: "open" });
    const { data: messages, error: e } = await db
      .from("website_messages")
      .select("id,role,body,created_at")
      .eq("conversation_id", c.id)
      .order("created_at")
      .order("id")
      .limit(200);
    if (e) throw e;
    return reply({ messages, status: c.status });
  } catch {
    return reply({ error: "Chat could not load. Please retry." }, 503);
  }
}
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") !== new URL(request.url).origin)
      return reply({ error: "Invalid request origin." }, 403);
    const raw = await request.text();
    if (raw.length > 8000)
      return reply({ error: "Message is too large." }, 413);
    const b = JSON.parse(raw);
    const kind = b.kind;
    const message = typeof b.message === "string" ? b.message.trim() : "";
    if (
      !["message", "handoff", "quote"].includes(kind) ||
      message.length > 2000 ||
      (kind === "message" && !message)
    )
      return reply({ error: "Enter a message up to 2,000 characters." }, 400);
    const name = String(b.name ?? "")
        .trim()
        .slice(0, 100),
      email = String(b.email ?? "")
        .trim()
        .slice(0, 200),
      country = String(b.country ?? "")
        .trim()
        .slice(0, 80),
      service = String(b.service ?? "");
    if (
      kind === "quote" &&
      (!name ||
        !country ||
        !services.includes(service as (typeof services)[number]) ||
        !/^\S+@\S+\.\S+$/.test(email) ||
        !message)
    )
      return reply(
        {
          error:
            "Complete your name, email, country, service and requirements.",
        },
        400,
      );
    const key = await session(true);
    const db = createAdminClient();
    const { data: existing, error: lookupError } = await db
      .from("website_conversations")
      .select("id,status")
      .eq("visitor_key", key)
      .maybeSingle();
    if (lookupError) throw lookupError;
    let c = existing;
    if (!c) {
      const { data, error } = await db
        .from("website_conversations")
        .insert({ visitor_key: key })
        .select("id,status")
        .single();
      if (error) throw error;
      c = data;
    }
    if (!c) throw Error("No conversation");
    const { count, error: countError } = await db
      .from("website_messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", c.id)
      .eq("role", "visitor");
    if (countError) throw countError;
    if ((count ?? 0) >= 80)
      return reply(
        {
          error:
            "This conversation has reached its message limit. Please contact us through the Contact page.",
        },
        429,
      );
    const answer =
      kind === "quote"
        ? {
            text: "Your quote request is saved. Our team will review your requirements and reply here or by email. Prices and availability will be confirmed by the team.",
            handoff: true,
          }
        : kind === "handoff"
          ? {
              text: "Your conversation is queued for the team. You can keep chatting here. A teammate will reply when available; this is not an instant live response.",
              handoff: true,
            }
          : c.status === "waiting"
            ? null
            : serviceAnswer(message);
    const body =
      kind === "quote"
        ? `Quote request — ${service}\nName: ${name}\nEmail: ${email}\nCountry: ${country}\n${message}`
        : kind === "handoff"
          ? "Please connect me with the team."
          : message;
    const rows = [
      { conversation_id: c.id, role: "visitor", body },
      ...(answer
        ? [{ conversation_id: c.id, role: "assistant", body: answer.text }]
        : []),
    ];
    const { error: saveError } = await db.from("website_messages").insert(rows);
    if (saveError) throw saveError;
    const { error: updateError } = await db
      .from("website_conversations")
      .update({
        status: answer?.handoff || c.status === "waiting" ? "waiting" : "open",
        updated_at: new Date().toISOString(),
        ...(kind === "quote"
          ? {
              customer_name: name,
              email,
              country,
              service,
              attribution:
                typeof b.attribution === "object"
                  ? JSON.stringify(b.attribution).slice(0, 2000)
                  : null,
            }
          : {}),
      })
      .eq("id", c.id);
    if (updateError) throw updateError;
    return reply({ ok: true });
  } catch {
    return reply(
      {
        error:
          "Your message could not be confirmed. Please retry or use the Contact page.",
      },
      503,
    );
  }
}

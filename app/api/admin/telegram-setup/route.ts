import { requireAdmin } from "@/lib/auth";
export async function POST(request: Request) {
  try { await requireAdmin(); } catch { return Response.json({ error: "Not authorized" }, { status: 403 }); }
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !secret || !chatId)
    return Response.json({ error: "Missing TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID or TELEGRAM_WEBHOOK_SECRET in production settings." }, { status: 503 });
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://www.fulfillmena.com/api/integrations/telegram", secret_token: secret, allowed_updates: ["message"], drop_pending_updates: false }),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json();
    if (!response.ok || !result.ok)
      return Response.json({ error: result.description ?? "Telegram rejected webhook setup." }, { status: 502 });
    return Response.json({ ok: true, message: "Telegram webhook registered. Reply to bot notifications to answer website visitors." });
  } catch {
    return Response.json({ error: "Telegram webhook setup could not connect." }, { status: 502 });
  }
}

import { createAdminClient } from "@/lib/supabase/admin";

const adminUrl = "https://fulfillmena.com/admin/conversations";
export async function notifyWebsiteChat(input: { conversationId: string; message: string; kind: string; name?: string; email?: string; country?: string }) {
  const short = input.message.slice(0, 1200);
  const subject = input.kind === "quote" ? "New FulfillMENA quote request" : input.kind === "handoff" ? "FulfillMENA: customer requests a human" : "New FulfillMENA chat message";
  const text = [subject, `Conversation: ${input.conversationId}`, input.name && `Name: ${input.name}`, input.email && `Email: ${input.email}`, input.country && `Country: ${input.country}`, "", short, "", `Admin inbox: ${adminUrl}`, "", `Telegram reply: /reply ${input.conversationId} Your message`].filter(Boolean).join("\n");
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) console.error("Telegram notification failed", response.status);
      else {
        const data = await response.json();
        if (data.ok && data.result?.message_id) {
          const db = createAdminClient();
          const { error } = await db.from("website_telegram_links").insert({
            telegram_message_id: data.result.message_id, conversation_id: input.conversationId,
          });
          if (error) console.error("Telegram reply mapping failed", error.message);
        }
      }
    } catch (error) { console.error("Telegram notification error", error); }
  }
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && process.env.CHAT_EMAIL_FROM) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.CHAT_EMAIL_FROM, to: ["bloompathsms@gmail.com"], subject, text }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) console.error("Chat email notification failed", response.status);
    } catch (error) { console.error("Chat email error", error); }
  }
}

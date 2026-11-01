import { requireAdminPage } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ConversationReply from "@/components/admin/ConversationReply";
export const dynamic = "force-dynamic";
export default async function Conversations() {
  await requireAdminPage();
  const db = await createClient();
  const { data, error } = await db
    .from("website_conversations")
    .select(
      "id,status,customer_name,email,country,service,updated_at,website_messages(id,role,body,created_at)",
    )
    .order("updated_at", { ascending: false })
    .limit(50);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-black">Website chat & quote inbox</h1>
        <p className="mt-2 text-slate-600">
          New leads and team requests arrive here. Reply in the same website
          chat. Refresh to check for new messages.
        </p>
        <a
          href="/admin/conversations"
          className="mt-3 inline-block font-bold text-blue-800 underline"
        >
          Refresh inbox
        </a>
      </div>
      {error ? (
        <p role="alert">Inbox could not load. Please refresh.</p>
      ) : !data?.length ? (
        <p className="rounded-2xl bg-white p-8">
          No website conversations yet.
        </p>
      ) : (
        data.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="text-lg font-bold">
                {c.customer_name || "Website visitor"} ·{" "}
                {c.service || "Service inquiry"}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold">
                {c.status === "waiting" ? "Needs team reply" : c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {[c.email, c.country].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
              {[...(c.website_messages ?? [])]
                .sort(
                  (a, b) =>
                    a.created_at.localeCompare(b.created_at) || a.id - b.id,
                )
                .map((m) => (
                  <div
                    key={m.id}
                    className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm"
                  >
                    <p className="mb-1 font-bold">
                      {m.role} ·{" "}
                      {new Intl.DateTimeFormat("en-AE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Dubai",
                      }).format(new Date(m.created_at))}
                    </p>
                    {m.body}
                  </div>
                ))}
            </div>
            <ConversationReply id={c.id} />
          </article>
        ))
      )}
    </div>
  );
}

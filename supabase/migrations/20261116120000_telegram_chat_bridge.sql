-- Private mapping between Telegram alert messages and website conversations.
create table if not exists public.website_telegram_links (
 telegram_message_id bigint primary key,
 conversation_id uuid not null references public.website_conversations(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.website_telegram_updates (
 update_id bigint primary key,
 created_at timestamptz not null default now()
);
alter table public.website_telegram_links enable row level security;
alter table public.website_telegram_updates enable row level security;
revoke all on public.website_telegram_links, public.website_telegram_updates from anon, authenticated;
grant all on public.website_telegram_links, public.website_telegram_updates to service_role;

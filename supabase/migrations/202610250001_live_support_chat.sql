create table if not exists public.support_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_token_hash text not null unique,
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  customer_email text,
  page_url text,
  status text not null default 'open' check (status in ('open', 'closed')),
  last_message text,
  last_sender_role text check (last_sender_role in ('customer', 'team')),
  unread_for_team boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  sender_role text not null check (sender_role in ('customer', 'team')),
  sender_id uuid references auth.users(id) on delete set null,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists support_conversations_updated_at_idx
  on public.support_conversations (updated_at desc);
create index if not exists support_messages_conversation_created_at_idx
  on public.support_messages (conversation_id, created_at);

alter table public.support_conversations enable row level security;
alter table public.support_messages enable row level security;

revoke all on public.support_conversations, public.support_messages from anon, authenticated;
grant all on public.support_conversations, public.support_messages to service_role;

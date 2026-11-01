create table public.website_conversations (
 id uuid primary key default gen_random_uuid(),
 visitor_key text not null unique check (length(visitor_key)=64),
 status text not null default 'open' check(status in ('open','waiting','resolved')),
 customer_name text, email text, country text, service text, attribution text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.website_messages (
 id bigint generated always as identity primary key,
 conversation_id uuid not null references public.website_conversations(id) on delete cascade,
 role text not null check(role in ('visitor','assistant','team')),
 body text not null check(length(body) between 1 and 2500),
 created_at timestamptz not null default now()
);
create index website_messages_conversation_idx on public.website_messages(conversation_id,created_at,id);
create index website_conversations_updated_idx on public.website_conversations(updated_at desc);
alter table public.website_conversations enable row level security;
alter table public.website_messages enable row level security;
revoke all on public.website_conversations,public.website_messages from anon;
grant select,update on public.website_conversations to authenticated;
grant select,insert on public.website_messages to authenticated;
grant usage,select on sequence public.website_messages_id_seq to authenticated;
grant all on public.website_conversations,public.website_messages to service_role;
grant usage,select on sequence public.website_messages_id_seq to service_role;
create policy "active staff read conversations" on public.website_conversations for select to authenticated using (
 exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.status='active' and p.role in ('super_admin','admin','manager','staff'))
);
create policy "active staff update conversations" on public.website_conversations for update to authenticated using (
 exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.status='active' and p.role in ('super_admin','admin','manager','staff'))
) with check (
 exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.status='active' and p.role in ('super_admin','admin','manager','staff'))
);
create policy "active staff read messages" on public.website_messages for select to authenticated using (
 exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.status='active' and p.role in ('super_admin','admin','manager','staff'))
);
create policy "active staff reply" on public.website_messages for insert to authenticated with check (
 role='team' and exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.status='active' and p.role in ('super_admin','admin','manager','staff'))
);

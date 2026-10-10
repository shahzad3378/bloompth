-- Workspace currency for BloomPath Courier SaaS.
-- Each workspace reports prices and orders in one currency.
-- Orders snapshot that currency so older reports stay accurate
-- if the workspace currency changes later.

alter table public.website_settings
  add column if not exists currency_code text default 'AED';

alter table public.website_settings
  add column if not exists locale text default 'en-AE';

alter table public.orders
  add column if not exists currency_code text;

update public.website_settings
set
  currency_code = coalesce(nullif(currency_code, ''), 'AED'),
  locale = coalesce(nullif(locale, ''), 'en-AE')
where id = 'main';

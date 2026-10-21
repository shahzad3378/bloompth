-- Global catalogue metadata. Apply to the review database before entering real origins/currencies.
alter table public.products
  add column if not exists origin_country text,
  add column if not exists currency_code text not null default 'AED';

alter table public.products
  drop constraint if exists products_currency_code_iso_check;

alter table public.products
  add constraint products_currency_code_iso_check
  check (currency_code ~ '^[A-Z]{3}$');

create index if not exists products_origin_country_idx
  on public.products (origin_country)
  where status = 'active';

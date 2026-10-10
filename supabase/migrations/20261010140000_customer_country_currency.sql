-- Customer country drives the currency shown to that customer.
-- Catalog prices stay in website_settings.currency_code.
-- Orders snapshot the customer's currency and the rate used.

alter table public.profiles
  add column if not exists country text;

alter table public.orders
  add column if not exists base_currency text;

alter table public.orders
  add column if not exists exchange_rate numeric;

alter table public.orders
  add column if not exists customer_country text;

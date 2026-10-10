import "server-only";

import { cookies } from "next/headers";
import { currencyForCountry, findCountry } from "@/lib/countries";
import {
  convertMoney,
  isMissingColumnError,
  resolveCurrency,
  type CurrencyOption,
} from "@/lib/currency";
import { getExchangeRate } from "@/lib/exchange-rates";
import { createClient } from "@/lib/supabase/server";

export const CUSTOMER_COUNTRY_COOKIE = "bp_country";

export type CustomerQuote = {
  country: string | null;
  currency: CurrencyOption;
  requested: CurrencyOption | null;
  catalog: CurrencyOption;
  rate: number;
  converted: boolean;
};

export function customerPriceNote(quote: CustomerQuote) {
  if (!quote.country) {
    return "Select your country to see this price in your currency.";
  }

  if (quote.converted) {
    return `Shown in ${quote.currency.code} for ${quote.country}. Catalog price is in ${quote.catalog.code}.`;
  }

  if (
    quote.requested &&
    quote.requested.code !== quote.catalog.code
  ) {
    return `The live rate for ${quote.requested.code} is unavailable, so this price stays in ${quote.catalog.code}.`;
  }

  return `Prices for ${quote.country} are in ${quote.currency.code}.`;
}

export async function readCustomerCountryCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(CUSTOMER_COUNTRY_COOKIE)?.value ?? "";

  return findCountry(value)?.name ?? null;
}

export async function getSellerCountry(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("country")
    .eq("id", userId)
    .maybeSingle();

  const profileCountry = !error
    ? findCountry(data?.country)?.name ?? null
    : null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const metadataCountry = findCountry(
    typeof user?.user_metadata?.country === "string"
      ? user.user_metadata.country
      : null
  )?.name ?? null;

  if (profileCountry) {
    return profileCountry;
  }

  if (
    metadataCountry &&
    !isMissingColumnError(error, "country")
  ) {
    await supabase
      .from("profiles")
      .update({ country: metadataCountry })
      .eq("id", userId);
  }

  return metadataCountry ?? (await readCustomerCountryCookie());
}

export async function resolveCustomerCountry(userId?: string | null) {
  if (userId) {
    return getSellerCountry(userId);
  }

  return readCustomerCountryCookie();
}

export async function quoteForCountry(
  country: string | null | undefined,
  catalog: CurrencyOption
): Promise<CustomerQuote> {
  const matched = findCountry(country);
  const customerCode = matched
    ? currencyForCountry(matched.name)
    : null;
  const customerCurrency = customerCode
    ? resolveCurrency(customerCode)
    : catalog;

  if (!matched || customerCurrency.code === catalog.code) {
    return {
      country: matched?.name ?? null,
      currency: catalog,
      requested: matched ? customerCurrency : null,
      catalog,
      rate: 1,
      converted: false,
    };
  }

  const rate = await getExchangeRate(
    catalog.code,
    customerCurrency.code
  );

  if (!rate) {
    return {
      country: matched.name,
      currency: catalog,
      requested: customerCurrency,
      catalog,
      rate: 1,
      converted: false,
    };
  }

  return {
    country: matched.name,
    currency: customerCurrency,
    requested: customerCurrency,
    catalog,
    rate,
    converted: true,
  };
}

export function quoteAmount(
  amount: number | string | null | undefined,
  quote: CustomerQuote
) {
  return convertMoney(amount, quote.rate, quote.currency.code);
}

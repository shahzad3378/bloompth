import { resolveCurrency } from "@/lib/currency";

const RATE_ENDPOINT = "https://open.er-api.com/v6/latest/USD";
const CACHE_MS = 6 * 60 * 60 * 1000;

type RateBook = {
  rates: Record<string, number>;
  fetchedAt: number;
};

let cachedRates: RateBook | null = null;

async function loadUsdRates() {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < CACHE_MS) {
    return cachedRates;
  }

  const response = await fetch(RATE_ENDPOINT, {
    cache: "no-store",
  });

  if (!response.ok) {
    return cachedRates;
  }

  const payload = (await response.json()) as {
    result?: string;
    rates?: Record<string, number>;
  };

  if (payload.result !== "success" || !payload.rates?.USD) {
    return cachedRates;
  }

  cachedRates = {
    rates: payload.rates,
    fetchedAt: Date.now(),
  };

  return cachedRates;
}

export async function getExchangeRate(
  baseCurrency: string | null | undefined,
  quoteCurrency: string | null | undefined
) {
  const base = resolveCurrency(baseCurrency).code;
  const quote = resolveCurrency(quoteCurrency).code;

  if (base === quote) {
    return 1;
  }

  try {
    const book = await loadUsdRates();
    const basePerUsd = book?.rates[base];
    const quotePerUsd = book?.rates[quote];

    if (!basePerUsd || !quotePerUsd) {
      return null;
    }

    return quotePerUsd / basePerUsd;
  } catch {
    return null;
  }
}

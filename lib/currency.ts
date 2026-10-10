export type CurrencyOption = {
  code: string;
  locale: string;
  label: string;
};

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "AED", locale: "en-AE", label: "UAE Dirham (AED)" },
  { code: "SAR", locale: "en-SA", label: "Saudi Riyal (SAR)" },
  { code: "QAR", locale: "en-QA", label: "Qatari Riyal (QAR)" },
  { code: "KWD", locale: "en-KW", label: "Kuwaiti Dinar (KWD)" },
  { code: "BHD", locale: "en-BH", label: "Bahraini Dinar (BHD)" },
  { code: "OMR", locale: "en-OM", label: "Omani Rial (OMR)" },
  { code: "USD", locale: "en-US", label: "US Dollar (USD)" },
  { code: "EUR", locale: "en-IE", label: "Euro (EUR)" },
  { code: "GBP", locale: "en-GB", label: "British Pound (GBP)" },
  { code: "INR", locale: "en-IN", label: "Indian Rupee (INR)" },
  { code: "PKR", locale: "en-PK", label: "Pakistani Rupee (PKR)" },
];

export const DEFAULT_CURRENCY_CODE = "AED";

const OPEN_ORDER_STATUSES = new Set([
  "pending",
  "confirmed",
  "processing",
  "shipped",
]);

export type CurrencyBucket = {
  code: string;
  locale: string;
  gross: number;
  grossCount: number;
  completed: number;
  completedCount: number;
  open: number;
  openCount: number;
  cancelled: number;
  cancelledCount: number;
};

export type CurrencyReport = {
  buckets: CurrencyBucket[];
  usesMultipleCurrencies: boolean;
};

type ReportOrder = {
  total_amount?: number | string | null;
  status?: string | null;
  currency_code?: string | null;
};

export function resolveCurrency(
  code?: string | null,
  locale?: string | null
): CurrencyOption {
  const normalized = (code ?? "").trim().toUpperCase();
  const match =
    SUPPORTED_CURRENCIES.find((item) => item.code === normalized) ??
    SUPPORTED_CURRENCIES[0];

  const customLocale = locale?.trim() ?? "";

  if (/^[a-z]{2}-[A-Z]{2}$/.test(customLocale)) {
    return { ...match, locale: customLocale };
  }

  return match;
}

export function formatMoney(
  value: number | string | null | undefined,
  currencyCode?: string | null,
  locale?: string | null
) {
  const currency = resolveCurrency(currencyCode, locale);
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatOrderMoney(
  value: number | string | null | undefined,
  orderCurrency: string | null | undefined,
  tenant: CurrencyOption
) {
  if (orderCurrency?.trim()) {
    return formatMoney(value, orderCurrency);
  }

  return formatMoney(value, tenant.code, tenant.locale);
}

export function formatReportDate(
  value: string | Date | null | undefined,
  locale: string
) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function currencyInputStep(currencyCode?: string | null) {
  const currency = resolveCurrency(currencyCode);

  try {
    const digits =
      new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
      }).resolvedOptions().maximumFractionDigits ?? 2;

    if (digits <= 0) {
      return "1";
    }

    return (1 / 10 ** digits).toFixed(digits);
  } catch {
    return "0.01";
  }
}

export function readCurrencyCode(record: object) {
  if (!("currency_code" in record)) {
    return null;
  }

  const value = (record as { currency_code?: unknown }).currency_code;

  return typeof value === "string" && value.trim()
    ? value.trim().toUpperCase()
    : null;
}

export function isMissingColumnError(
  error: { message?: string } | null | undefined,
  column: string
) {
  return Boolean(
    error?.message?.toLowerCase().includes(column.toLowerCase())
  );
}

function emptyBucket(currency: CurrencyOption): CurrencyBucket {
  return {
    code: currency.code,
    locale: currency.locale,
    gross: 0,
    grossCount: 0,
    completed: 0,
    completedCount: 0,
    open: 0,
    openCount: 0,
    cancelled: 0,
    cancelledCount: 0,
  };
}

export function summarizeOrders(
  orders: ReportOrder[],
  tenant: CurrencyOption
): CurrencyReport {
  const buckets = new Map<string, CurrencyBucket>();

  for (const order of orders) {
    const currency = order.currency_code?.trim()
      ? resolveCurrency(order.currency_code)
      : tenant;
    const bucket =
      buckets.get(currency.code) ?? emptyBucket(currency);
    const amount = Number(order.total_amount ?? 0);
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    const status = (order.status ?? "").toLowerCase();

    if (status === "cancelled") {
      bucket.cancelled += safeAmount;
      bucket.cancelledCount += 1;
    } else if (status === "completed") {
      bucket.gross += safeAmount;
      bucket.grossCount += 1;
      bucket.completed += safeAmount;
      bucket.completedCount += 1;
    } else if (OPEN_ORDER_STATUSES.has(status) || status === "") {
      bucket.gross += safeAmount;
      bucket.grossCount += 1;
      bucket.open += safeAmount;
      bucket.openCount += 1;
    } else {
      bucket.gross += safeAmount;
      bucket.grossCount += 1;
      bucket.open += safeAmount;
      bucket.openCount += 1;
    }

    buckets.set(currency.code, bucket);
  }

  return {
    buckets: [...buckets.values()],
    usesMultipleCurrencies: buckets.size > 1,
  };
}

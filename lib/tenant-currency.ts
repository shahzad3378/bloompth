import { createClient } from "@/lib/supabase/server";
import { resolveCurrency, type CurrencyOption } from "@/lib/currency";

export async function getTenantCurrency(): Promise<CurrencyOption> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("website_settings")
      .select("currency_code, locale")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data) {
      return resolveCurrency();
    }

    return resolveCurrency(data.currency_code, data.locale);
  } catch {
    return resolveCurrency();
  }
}

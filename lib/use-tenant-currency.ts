"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { resolveCurrency, type CurrencyOption } from "@/lib/currency";

export function useTenantCurrency() {
  const [currency, setCurrency] = useState<CurrencyOption>(() =>
    resolveCurrency()
  );

  useEffect(() => {
    let active = true;

    async function loadCurrency() {
      const { data, error } = await supabase
        .from("website_settings")
        .select("currency_code, locale")
        .eq("id", "main")
        .maybeSingle();

      if (!active || error || !data) {
        return;
      }

      setCurrency(resolveCurrency(data.currency_code, data.locale));
    }

    loadCurrency();

    return () => {
      active = false;
    };
  }, []);

  return currency;
}

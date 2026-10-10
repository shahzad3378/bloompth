"use client";

import { COUNTRIES } from "@/lib/countries";
import { setCustomerCountry } from "@/app/customer-country/actions";

type CustomerCountrySelectProps = {
  country: string | null;
  compact?: boolean;
};

export default function CustomerCountrySelect({
  country,
  compact = false,
}: CustomerCountrySelectProps) {
  return (
    <form action={setCustomerCountry} className={compact ? "" : "mt-4"}>
      <label className="block text-sm font-bold text-slate-700">
        Your country
        <select
          name="country"
          defaultValue={country ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-emerald-500"
          onChange={(event) => {
            event.currentTarget.form?.requestSubmit();
          }}
        >
          <option value="" disabled>
            Select your country
          </option>
          {COUNTRIES.map((item) => (
            <option key={item.code} value={item.name}>
              {item.name} · {item.currency}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="mt-3 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-600"
      >
        Show this currency
      </button>
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Prices follow the currency of the country you select.
      </p>
    </form>
  );
}

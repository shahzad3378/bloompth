"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SearchableOption = { value: string; label: string; searchText?: string; buttonLabel?: string };

export function SearchableSelect({
  value, options, onChange, placeholder, searchPlaceholder, ariaLabel,
}: {
  value: string;
  options: SearchableOption[];
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => `${option.label} ${option.searchText ?? ""}`.toLowerCase().includes(normalized));
  }, [options, query]);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  useEffect(() => {
    if (open) search.current?.focus();
  }, [open]);

  return (
    <div ref={root} className="relative mt-2">
      <button type="button" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={() => { setQuery(""); setOpen((current) => !current); }} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left outline-none focus:border-emerald-500">
        <span className={selected ? "truncate text-slate-900" : "truncate text-slate-400"}>{selected?.buttonLabel ?? selected?.label ?? placeholder}</span>
        <ChevronDown size={18} className={`shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-100 p-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} aria-label={searchPlaceholder} className="w-full border-0 py-2.5 text-sm outline-none" />
          </div>
        </div>
        <div role="listbox" aria-label={ariaLabel} className="max-h-56 overflow-y-auto p-1">
          {filtered.length ? filtered.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setQuery(""); setOpen(false); }} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-emerald-50">
            <span className="truncate">{option.label}</span>{option.value === value && <Check size={16} className="shrink-0 text-emerald-700" />}
          </button>) : <p className="px-3 py-4 text-center text-sm text-slate-500">No matching options</p>}
        </div>
      </div>}
    </div>
  );
}

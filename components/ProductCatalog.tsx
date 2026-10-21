"use client";

import Link from "next/link";
import CurrencyPrice from "@/components/CurrencyPrice";
import { currencyForCountryName, flagForCountryName } from "@/lib/countries";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  PackageSearch,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  price: number | null;
  sale_price: number | null;
  stock: number;
  image: string | null;
  featured: boolean;
  origin_country?: string | null;
  stock_country?: string | null;
  currency_code?: string | null;
};

type ProductCatalogProps = {
  products: Product[];
};

function isLocalProduct(origin: string | null | undefined, destination: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");
  const aliases: Record<string, string[]> = {
    "unitedarabemirates": ["uae", "emirates"],
    "unitedstates": ["usa", "us", "america"],
    "canada": ["ca"],
    "pakistan": ["pk"],
    "china": ["cn"],
  };
  if (!origin) return false;
  const o = normalize(origin), d = normalize(destination);
  return o === d || (aliases[d] || []).includes(o) || (aliases[o] || []).includes(d);
}

export default function ProductCatalog({
  products,
}: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [originFilter, setOriginFilter] = useState("All");
  const [deliveryCountry, setDeliveryCountry] = useState("United Arab Emirates");

  useEffect(() => {
    const readMarket = (event?: Event) => {
      const detail = (event as CustomEvent<{ country?: string }> | undefined)?.detail;
      const country = detail?.country || localStorage.getItem("bp-deliver-country") || "United Arab Emirates";
      setDeliveryCountry(country);
    };
    readMarket();
    window.addEventListener("bp-market-change", readMarket);
    return () => window.removeEventListener("bp-market-change", readMarket);
  }, []);

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category?.trim())
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(productCategories)).sort()];
  }, [products]);

  const origins = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.stock_country?.trim()).filter((v): v is string => Boolean(v)))).sort()], [products]);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const title = product.title.toLowerCase();
      const category = product.category?.toLowerCase() ?? "";
      const description = product.description?.toLowerCase() ?? "";

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        category.includes(searchTerm) ||
        description.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesOrigin = originFilter === "All" || product.stock_country === originFilter;
      return matchesSearch && matchesCategory && matchesOrigin;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        const localA = isLocalProduct(a.stock_country, deliveryCountry) && Number(a.stock) > 0;
        const localB = isLocalProduct(b.stock_country, deliveryCountry) && Number(b.stock) > 0;
        if (localA !== localB) return localA ? -1 : 1;
      }
      const priceA = Number(a.sale_price ?? a.price ?? 0);
      const priceB = Number(b.sale_price ?? b.price ?? 0);

      if (sortBy === "price-low") {
        return priceA - priceB;
      }

      if (sortBy === "price-high") {
        return priceB - priceA;
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "stock") {
        return Number(b.stock) - Number(a.stock);
      }

      return Number(b.featured) - Number(a.featured);
    });
  }, [products, search, selectedCategory, sortBy, originFilter, deliveryCountry]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("newest");
    setOriginFilter("All");
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== "All" ||
    sortBy !== "newest" ||
    originFilter !== "All";

  return (
    <div>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_210px_190px]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </label>

        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          <span className="sr-only">Available in country</span>
          <select value={originFilter} onChange={(event) => setOriginFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal text-slate-800">
            <option value="All">🌐 All countries</option>
            {origins.slice(1).map((origin) => <option key={origin} value={origin}>{flagForCountryName(origin)}  {origin}</option>)}
          </select>
        </label>

        <label className="relative block">
          <span className="sr-only">Sort products</span>
          <SlidersHorizontal size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-8 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="newest">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
            <option value="stock">Highest Stock</option>
          </select>
        </label>
      </div>

      <div className="mt-2 flex min-h-8 items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-700">
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-700">
            Showing{" "}
            <span className="text-blue-600">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {selectedCategory !== "All" && (
            <p className="mt-1 text-xs text-slate-500">
              Category: {selectedCategory}
            </p>
          )}
        </div>

      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <PackageSearch size={30} />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-950">
            {products.length === 0 ? "Catalogue is being prepared" : "No matching products found"}
          </h2>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
            {products.length === 0 ? "No active products are publicly listed yet. Product photos, stock origins and prices will appear here once the real inventory is added and published. You can request any product in the meantime." : "Try changing your search keyword or selecting another category. You can also send BloomPath your product requirement."}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reset Search
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const displayPrice = product.sale_price ?? product.price;
            const stock = Number(product.stock ?? 0);

            const hasSale =
              product.sale_price !== null &&
              product.price !== null &&
              Number(product.sale_price) < Number(product.price);

            const discountPercentage = hasSale
              ? Math.round(
                  ((Number(product.price) -
                    Number(product.sale_price)) /
                    Number(product.price)) *
                    100
                )
              : 0;

            return (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 sm:rounded-3xl bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                        <PackageSearch size={38} />

                        <span className="text-sm font-semibold">
                          No product image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-black shadow-sm ${
                        stock > 0
                          ? "bg-white text-blue-700"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {stock > 0 ? "Available" : "Out of Stock"}
                    </span>

                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-slate-800 shadow-sm">
                      {product.stock_country ? `${isLocalProduct(product.stock_country, deliveryCountry) && stock > 0 ? "📍 " : "📦 "}${product.stock_country}${product.origin_country ? ` · Origin: ${product.origin_country}` : ""}` : product.origin_country ? `🌐 Origin: ${product.origin_country} · Stock location not listed` : "🌐 Global sourcing"}
                    </span>
                    {hasSale && (
                      <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                        {discountPercentage}% Off
                      </span>
                    )}
                  </div>

                  {product.featured && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                      <Sparkles size={13} />
                      Featured
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-3 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-xs font-black uppercase tracking-wider text-blue-600">
                      {product.category || "General"}
                    </p>

                    {stock > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                        <BadgeCheck size={14} />
                        Verified
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${product.slug}`}>
                    <h2 className="mt-2 line-clamp-2 text-sm font-black leading-5 sm:text-lg sm:leading-6 text-slate-950 transition group-hover:text-blue-600">
                      {product.title}
                    </h2>
                  </Link>

                  <p className="mt-3 hidden line-clamp-2 text-sm leading-6 text-slate-600 sm:block">
                    {product.description ||
                      "Product details and sourcing information are available on request."}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Wholesale price</p>
                  <div className="mt-2 text-2xl font-black text-slate-950">
                    <CurrencyPrice amount={displayPrice ?? 0} baseCurrency={currencyForCountryName(product.stock_country || "") || product.currency_code || "USD"} />
                  </div>
                  {hasSale && product.price ? <p className="mt-1 text-xs text-slate-500">Regular price: <CurrencyPrice amount={product.price} baseCurrency={currencyForCountryName(product.stock_country || "") || product.currency_code || "USD"} /></p> : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-2 py-2.5 text-center text-xs sm:px-3 sm:py-3 sm:text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/request-product?product=${encodeURIComponent(
                          product.title
                        )}&productId=${product.id}`}
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-950 px-2 py-2.5 text-center text-xs sm:px-3 sm:py-3 sm:text-sm font-black text-white transition hover:bg-blue-600"
                      >
                        Request
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

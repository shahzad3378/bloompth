"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
};

type ProductCatalogProps = {
  products: Product[];
};

export default function ProductCatalog({
  products,
}: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const categories = useMemo(() => {
    const productCategories = products
      .map((product) => product.category?.trim())
      .filter((category): category is string => Boolean(category));

    return ["All", ...Array.from(new Set(productCategories)).sort()];
  }, [products]);

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

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
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
  }, [products, search, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("newest");
  };

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== "All" ||
    sortBy !== "newest";

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 sm:rounded-3xl bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_230px]">
          <label className="relative block">
            <span className="sr-only">Search products</span>

            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product name, category or keyword..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Sort products</span>

            <SlidersHorizontal
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="newest">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
              <option value="stock">Highest Stock</option>
            </select>
          </label>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-700">
            Showing{" "}
            <span className="text-emerald-600">
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

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm font-black text-emerald-600 transition hover:text-emerald-700"
          >
            <RotateCcw size={16} />
            Clear filters
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 sm:rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <PackageSearch size={30} />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-950">
            No matching products found
          </h2>

          <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
            Try changing your search keyword or selecting another category.
            You can also send BloomPath your product requirement.
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

            <Link
              href="/request-product"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Request a Product
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 sm:rounded-3xl bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
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
                          ? "bg-white text-emerald-700"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {stock > 0 ? "Available" : "Out of Stock"}
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
                    <p className="line-clamp-1 text-xs font-black uppercase tracking-wider text-emerald-600">
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
                    <h2 className="mt-2 line-clamp-2 text-sm font-black leading-5 sm:text-lg sm:leading-6 text-slate-950 transition group-hover:text-emerald-600">
                      {product.title}
                    </h2>
                  </Link>

                  <p className="mt-3 hidden line-clamp-2 text-sm leading-6 text-slate-600 sm:block">
                    {product.description ||
                      "Product details and sourcing information are available on request."}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Starting price
                      </p>

                      <div className="mt-1 flex flex-wrap items-end gap-2">
                        <span className="text-base font-black text-slate-950 sm:text-xl">
                          {displayPrice !== null
                            ? `AED ${Number(displayPrice).toFixed(2)}`
                            : "Contact for Price"}
                        </span>

                        {hasSale && (
                          <span className="pb-0.5 text-sm font-semibold text-slate-400 line-through">
                            AED {Number(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>
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
                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-950 px-2 py-2.5 text-center text-xs sm:px-3 sm:py-3 sm:text-sm font-black text-white transition hover:bg-emerald-600"
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
import Link from "next/link";
import {
  ArrowUpRight,
  CarFront,
  Headphones,
  HeartPulse,
  House,
  PawPrint,
  ShoppingBag,
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    description: "Tech products and useful accessories",
    href: "/products?category=Electronics",
    icon: Headphones,
  },
  {
    name: "Health & Beauty",
    description: "Personal care and beauty products",
    href: "/products?category=Health%20%26%20Beauty",
    icon: HeartPulse,
  },
  {
    name: "Home & Kitchen",
    description: "Products for everyday home use",
    href: "/products?category=Home%20%26%20Kitchen",
    icon: House,
  },
  {
    name: "Fashion",
    description: "Clothing and lifestyle accessories",
    href: "/products?category=Fashion",
    icon: ShoppingBag,
  },
  {
    name: "Automotive",
    description: "Car accessories and useful equipment",
    href: "/products?category=Automotive",
    icon: CarFront,
  },
  {
    name: "Pet Supplies",
    description: "Products for pets and their owners",
    href: "/products?category=Pet%20Supplies",
    icon: PawPrint,
  },
];

export default function Categories() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
              Product Categories
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Find products for your online store across BloomPath&apos;s main
              wholesale categories.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 text-sm font-black text-emerald-700 transition hover:text-emerald-600"
          >
            View all products
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-50 transition duration-300 group-hover:scale-125 group-hover:bg-emerald-100" />

                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={23} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-slate-950 transition group-hover:text-emerald-700 sm:text-lg">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition duration-300 group-hover:border-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
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
    <section className="border-y border-line bg-sand-100 py-16 sm:py-20">
      <div className="bp-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="bp-eyebrow text-brand-900">
              Browse product categories
            </p>

            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
              Find your next UAE product test.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
              Explore BloomPath&apos;s product catalogue by category, then
              confirm stock, wholesale pricing and fulfillment options.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-black text-brand-900 transition hover:gap-3"
          >
            View all products
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative cursor-pointer overflow-hidden rounded-[1.25rem] border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-lg"
              >
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900 transition duration-300 group-hover:bg-brand-900 group-hover:text-white">
                    <Icon size={23} strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-black text-ink transition group-hover:text-brand-900 sm:text-lg">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition duration-300 group-hover:border-brand-900 group-hover:bg-brand-900 group-hover:text-white">
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

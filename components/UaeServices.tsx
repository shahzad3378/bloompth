import Link from "next/link";
import { ArrowUpRight, Boxes, PackageSearch, Truck, Warehouse } from "lucide-react";

const services = [
  {
    label: "Start lean",
    title: "UAE Dropshipping",
    description:
      "Test products and start selling without setting up your own storage and packing team.",
    points: [
      "Access available products",
      "Order processing support",
      "COD delivery coordination",
    ],
    icon: Truck,
    href: "/dropshipping-uae",
    tone: "bg-brand-900 text-white",
    muted: "text-white/65",
    iconTone: "bg-brand-500 text-brand-950",
  },
  {
    label: "Improve margins",
    title: "Wholesale Supply",
    description:
      "Buy selected products in volume and build a more predictable UAE inventory plan.",
    points: [
      "Product sourcing",
      "Quantity-based quotations",
      "Local stock planning",
    ],
    icon: Boxes,
    href: "/products",
    tone: "bg-white text-ink",
    muted: "text-muted",
    iconTone: "bg-brand-100 text-brand-900",
  },
  {
    label: "Scale operations",
    title: "Warehousing & Fulfillment",
    description:
      "Store inventory locally while BloomPath supports picking, packing and dispatch workflows.",
    points: [
      "UAE inventory storage",
      "Pick and pack",
      "Last-mile handover",
    ],
    icon: Warehouse,
    href: "/contact",
    tone: "bg-sand-100 text-ink",
    muted: "text-muted",
    iconTone: "bg-white text-brand-900",
  },
];

export default function UaeServices() {
  return (
    <section className="bg-white py-16 sm:py-24" id="services">
      <div className="bp-container">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div>
            <p className="bp-eyebrow text-brand-900">Choose your operating model</p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
              Start where you are. Scale when it works.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end">
            BloomPath is designed for sellers at different stages—from testing a
            first product to managing regular UAE order volume. Choose a model
            that matches your stock, cash flow and growth plan.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className={
                  service.tone +
                  " group flex min-h-[390px] flex-col rounded-[1.5rem] border border-line p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7"
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={
                      service.iconTone +
                      " flex h-12 w-12 items-center justify-center rounded-2xl"
                    }
                  >
                    <Icon size={23} />
                  </span>
                  <span className={"bp-eyebrow " + service.muted}>
                    {service.label}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-black tracking-tight">
                  {service.title}
                </h3>
                <p className={"mt-3 text-sm leading-7 " + service.muted}>
                  {service.description}
                </p>
                <ul className={"mt-6 space-y-3 text-sm font-bold " + service.muted}>
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <PackageSearch
                        size={16}
                        className="shrink-0 text-brand-500"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="mt-auto inline-flex w-fit cursor-pointer items-center gap-2 pt-8 text-sm font-black transition group-hover:gap-3"
                >
                  Learn more <ArrowUpRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

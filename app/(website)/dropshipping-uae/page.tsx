import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Boxes,
  Check,
  ClipboardCheck,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Store,
  Truck,
  Warehouse,
} from "lucide-react";
import ConversionCta from "@/components/ConversionCta";
import FulfillmentProcess from "@/components/FulfillmentProcess";
import UaeFaq from "@/components/UaeFaq";

export const metadata: Metadata = {
  title: "UAE Dropshipping & Fulfillment",
  description:
    "Start and scale a UAE dropshipping business with local product sourcing, warehousing, order processing, COD coordination and last-mile fulfillment support.",
  alternates: {
    canonical: "/dropshipping-uae",
  },
};

const supportAreas = [
  {
    icon: ShoppingBag,
    title: "Product access",
    description:
      "Explore products available for UAE sellers and request sourcing support for specific requirements.",
  },
  {
    icon: Warehouse,
    title: "Local inventory",
    description:
      "Use UAE-held stock or discuss storage for your own suitable products.",
  },
  {
    icon: ClipboardCheck,
    title: "Order coordination",
    description:
      "Set a repeatable method for sharing complete, confirmed customer orders.",
  },
  {
    icon: PackageCheck,
    title: "Pick and pack",
    description:
      "Orders are prepared according to the agreed product and packing workflow.",
  },
  {
    icon: Truck,
    title: "Last-mile handover",
    description:
      "Shipments are handed to supported UAE delivery partners for customer delivery.",
  },
  {
    icon: Banknote,
    title: "COD status support",
    description:
      "Delivery and COD information is coordinated under the agreed seller terms.",
  },
];

const sellerResponsibilities = [
  "Choose the product and selling offer",
  "Create accurate ads and product claims",
  "Manage your store and marketing budget",
  "Send complete customer order details",
  "Review performance and customer feedback",
];

const bloomPathResponsibilities = [
  "Confirm product and stock availability",
  "Agree the UAE operating workflow",
  "Prepare orders for dispatch",
  "Coordinate delivery-status information",
  "Support inventory and replenishment planning",
];

export default function DropshippingUaePage() {
  const whatsappUrl =
    "https://wa.me/971507297900?text=Hello%20BloomPath%2C%20I%20want%20to%20start%20dropshipping%20in%20the%20UAE.";

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-sand-100 py-14 sm:py-20 lg:py-24">
        <div className="bp-dot-pattern pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-45" />
        <div className="bp-container relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 bg-white px-4 py-2 text-xs font-black text-brand-900 shadow-sm">
              <BadgeCheck size={16} className="text-brand-500" />
              UAE dropshipping, built around real operations
            </div>
            <h1 className="bp-display mt-6 max-w-3xl text-[2.75rem] text-ink sm:text-6xl lg:text-[4.25rem]">
              Start selling in the UAE without building a warehouse team.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              BloomPath helps online sellers connect product sourcing, local
              inventory, order processing, packing, COD coordination and
              last-mile dispatch in one practical UAE workflow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 py-3.5 text-sm font-black text-white transition hover:bg-brand-950"
              >
                Browse products <ArrowRight size={18} />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-900/20 bg-white px-6 py-3.5 text-sm font-black text-brand-900 transition hover:border-brand-900 hover:bg-brand-100"
              >
                <MessageCircle size={18} />
                Plan my setup
              </a>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-brand-950 p-6 text-white shadow-[0_28px_80px_rgba(5,44,32,0.25)] sm:p-8">
            <p className="bp-eyebrow text-brand-500">Your UAE operating stack</p>
            <h2 className="mt-3 text-2xl font-black">
              Four layers your store needs behind the scenes.
            </h2>
            <div className="mt-7 space-y-3">
              {[
                { icon: ShoppingBag, label: "Sell", detail: "Your store, marketplace or social channel" },
                { icon: Boxes, label: "Stock", detail: "Available products or your local inventory" },
                { icon: Warehouse, label: "Fulfill", detail: "Pick, pack and dispatch workflow" },
                { icon: Truck, label: "Deliver", detail: "UAE last-mile and COD coordination" },
              ].map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <div
                    key={layer.label}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-brand-950">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-black">{layer.label}</p>
                      <p className="mt-1 text-xs leading-5 text-white/48">
                        {layer.detail}
                      </p>
                    </div>
                    <span className="text-xs font-black text-brand-500">
                      0{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-xs leading-6 text-white/42">
              The exact product, courier, rate and COD terms are confirmed for
              each seller before orders are accepted.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="bp-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="bp-eyebrow text-brand-900">What BloomPath supports</p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
              The operational pieces, connected.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              Start with the services you need now and agree a workflow that can
              grow with your UAE order volume.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {supportAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article
                  key={area.title}
                  className="rounded-[1.35rem] border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                    <Icon size={21} />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-ink">{area.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {area.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-sand-100 py-16 sm:py-24">
        <div className="bp-container">
          <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white lg:grid-cols-2">
            <div className="p-6 sm:p-9 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sand-100 text-brand-900">
                  <Store size={21} />
                </span>
                <div>
                  <p className="bp-eyebrow text-muted">You control</p>
                  <h2 className="mt-1 text-2xl font-black text-ink">The customer offer</h2>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {sellerResponsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-ink/75">
                    <Check size={17} className="mt-1 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-900 p-6 text-white sm:p-9 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-brand-950">
                  <Warehouse size={21} />
                </span>
                <div>
                  <p className="bp-eyebrow text-brand-100">BloomPath supports</p>
                  <h2 className="mt-1 text-2xl font-black">The fulfillment operation</h2>
                </div>
              </div>
              <ul className="mt-7 space-y-4">
                {bloomPathResponsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold leading-6 text-white/72">
                    <Check size={17} className="mt-1 shrink-0 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FulfillmentProcess />
      <UaeFaq />
      <ConversionCta />
    </main>
  );
}

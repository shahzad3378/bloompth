import Link from "next/link";
import {
  BadgeCheck,
  Banknote,
  Box,
  Check,
  CircleDot,
  MapPin,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Truck,
  Warehouse,
} from "lucide-react";

const orderSteps = [
  { label: "Order received", detail: "Store or manual upload", icon: ShoppingBag },
  { label: "Picked & packed", detail: "Processed in UAE", icon: PackageCheck },
  { label: "Out for delivery", detail: "Last-mile handover", icon: Truck },
  { label: "COD reconciled", detail: "Status recorded", icon: Banknote },
];

const trustPoints = [
  "No warehouse setup",
  "Local order processing",
  "Seller support on WhatsApp",
];

export default function Hero() {
  const whatsappUrl =
    "https://wa.me/971507297900?text=Hello%20BloomPath%2C%20I%20want%20to%20discuss%20UAE%20dropshipping%20and%20fulfillment.";

  return (
    <section className="relative overflow-hidden bg-sand-100">
      <div className="bp-dot-pattern pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] opacity-45 lg:block" />

      <div className="bp-container relative grid gap-12 py-14 sm:py-18 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-14 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 bg-white px-4 py-2 text-xs font-black text-brand-900 shadow-sm">
            <MapPin size={15} className="text-brand-500" />
            Built for UAE e-commerce sellers
          </div>

          <h1 className="bp-display mt-6 max-w-3xl text-[2.75rem] text-ink sm:text-6xl lg:text-[4.35rem]">
            Turn UAE orders into{" "}
            <span className="relative whitespace-nowrap text-brand-900">
              delivered customers.
              <span className="absolute -bottom-1 left-0 h-2 w-full -rotate-1 bg-brand-500/25" />
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Source products, keep stock locally and fulfill orders without
            building your own warehouse operation. BloomPath supports online
            sellers with UAE product sourcing, dropshipping, wholesale, packing,
            COD coordination and last-mile dispatch.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-900 px-6 py-3.5 text-sm font-black text-white shadow-[0_10px_30px_rgba(7,62,42,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-950"
            >
              Explore products
              <ArrowIcon />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-900/20 bg-white px-6 py-3.5 text-sm font-black text-brand-900 transition hover:-translate-y-0.5 hover:border-brand-900 hover:bg-brand-100"
            >
              <MessageCircle size={18} />
              Discuss your business
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3" aria-label="BloomPath advantages">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2 text-xs font-bold text-ink/75 sm:text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-900">
                  <Check size={13} strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[590px] lg:mx-0">
          <div className="absolute -left-5 -top-5 hidden rounded-2xl border border-brand-900/10 bg-white px-4 py-3 shadow-lg sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                <Warehouse size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Inventory</p>
                <p className="text-sm font-black text-ink">Stored in UAE</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-950 text-white shadow-[0_28px_80px_rgba(5,44,32,0.28)]">
            <div className="bp-grid-pattern border-b border-white/10 px-5 py-5 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="bp-eyebrow text-brand-500">Sample fulfillment flow</p>
                  <h2 className="mt-2 text-xl font-black sm:text-2xl">One order. One clear journey.</h2>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-[11px] font-black text-brand-100">
                  <CircleDot size={13} className="text-brand-500" />
                  UAE
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-brand-950">
                    <Box size={19} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Example order</p>
                    <p className="mt-0.5 text-sm font-black">BP-UAE-1024</p>
                  </div>
                </div>
                <BadgeCheck className="text-brand-500" size={22} />
              </div>

              <div className="relative mt-6">
                <div className="absolute bottom-6 left-[19px] top-6 w-px bg-white/10" />
                <div className="bp-progress-line absolute bottom-6 left-[19px] top-6 w-px bg-brand-500" />

                <ol className="relative space-y-3">
                  {orderSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <li key={step.label} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                        <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-brand-950">
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black tracking-[0.12em] text-brand-500">0{index + 1}</span>
                            <p className="text-sm font-black text-white">{step.label}</p>
                          </div>
                          <p className="mt-1 text-xs text-white/48">{step.detail}</p>
                        </div>
                        <Check size={16} className="shrink-0 text-brand-500" />
                      </li>
                    );
                  })}
                </ol>
              </div>

              <p className="mt-5 text-center text-[11px] leading-5 text-white/42">
                Workflow shown for illustration. Service availability and
                timelines are confirmed for each seller.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 -right-3 hidden items-center gap-3 rounded-2xl border border-brand-900/10 bg-white px-4 py-3 shadow-lg sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7f7ec] text-brand-900">
              <Banknote size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">Payments</p>
              <p className="text-sm font-black text-ink">COD supported</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none">
      <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

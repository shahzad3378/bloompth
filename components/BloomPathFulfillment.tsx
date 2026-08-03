import {
  Box,
  CheckCircle2,
  PackageCheck,
  Truck,
  Warehouse,
} from "lucide-react";

const fulfillmentSteps = [
  {
    icon: Box,
    number: "01",
    title: "Choose Products",
    description:
      "Select products from BloomPath that match your store and customers.",
  },
  {
    icon: Warehouse,
    number: "02",
    title: "Store Inventory",
    description:
      "Keep stock in our UAE warehouse and let us manage inventory.",
  },
  {
    icon: PackageCheck,
    number: "03",
    title: "Process Orders",
    description:
      "We prepare, pack and process every confirmed customer order.",
  },
  {
    icon: Truck,
    number: "04",
    title: "Deliver to Customers",
    description:
      "Orders are dispatched quickly for reliable delivery across the UAE.",
  },
];

const servicePoints = [
  "UAE-based inventory storage",
  "Wholesale product support",
  "Order processing and packing",
  "Reliable last-mile dispatch",
];

export default function BloomPathFulfillment() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-xl">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative border-b border-white/10 p-6 sm:p-9 lg:border-b-0 lg:border-r">
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 sm:text-sm">
                  BloomPath Fulfillment
                </p>

                <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  From Product Selection to Customer Delivery
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Focus on growing your online business while BloomPath handles
                  inventory, order processing, packing and UAE fulfillment.
                </p>

                <div className="mt-7 space-y-3">
                  {servicePoints.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 text-sm font-semibold text-slate-200"
                    >
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-emerald-400"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-black text-emerald-400 sm:text-2xl">
                      UAE
                    </p>

                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Local Stock
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-black text-emerald-400 sm:text-2xl">
                      B2B
                    </p>

                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Wholesale
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-black text-emerald-400 sm:text-2xl">
                      3PL
                    </p>

                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Fulfillment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-9">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                    Simple Process
                  </p>

                  <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                    How Fulfillment Works
                  </h3>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950">
                  <PackageCheck size={28} strokeWidth={2.4} />
                </div>
              </div>

              <div className="relative mt-8 space-y-4">
                <div className="absolute bottom-6 left-[25px] top-6 hidden w-px bg-white/10 sm:block" />

                {fulfillmentSteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="group relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-emerald-400/40 hover:bg-white/[0.07]"
                    >
                      <div className="relative z-10 flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-black tracking-[0.18em] text-emerald-400">
                            {step.number}
                          </span>

                          <h4 className="font-black text-white">
                            {step.title}
                          </h4>
                        </div>

                        <p className="mt-1.5 text-sm leading-6 text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
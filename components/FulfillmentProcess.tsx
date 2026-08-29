import {
  Banknote,
  ClipboardCheck,
  PackageCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Choose products or send stock",
    description:
      "Select available products or discuss storing your own inventory in our UAE operation.",
  },
  {
    icon: ClipboardCheck,
    title: "Share confirmed orders",
    description:
      "Orders can be coordinated from your store workflow or through an agreed order-upload process.",
  },
  {
    icon: PackageCheck,
    title: "We pick, pack and dispatch",
    description:
      "The operations team prepares each order and hands it to the selected UAE delivery partner.",
  },
  {
    icon: Banknote,
    title: "Track status and COD",
    description:
      "Delivery and COD information is recorded according to the agreed seller workflow.",
  },
];

export default function FulfillmentProcess() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 bg-brand-950 py-16 text-white sm:py-24"
    >
      <div className="bp-container">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="bp-eyebrow text-brand-500">How it works</p>
            <h2 className="bp-display mt-4 text-4xl sm:text-5xl">
              A practical path from product to doorstep.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-white/62">
              Your exact setup depends on product ownership, order volume and
              delivery requirements. The operating sequence stays simple and
              visible.
            </p>
            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-brand-100">
              <Truck size={19} className="text-brand-500" />
              UAE delivery workflow
            </div>
          </div>

          <ol className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="group grid gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 transition hover:border-brand-500/45 hover:bg-white/[0.07] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-brand-950">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/55">
                      {step.description}
                    </p>
                  </div>
                  <span className="bp-display text-4xl text-white/12">
                    0{index + 1}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

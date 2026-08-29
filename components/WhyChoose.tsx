import {
  BadgeDollarSign,
  Headset,
  MapPinned,
  PackageSearch,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const benefits = [
  {
    icon: MapPinned,
    title: "UAE-first operation",
    description:
      "Local stock and order handling make it easier to build a workflow around UAE customer expectations.",
  },
  {
    icon: PackageSearch,
    title: "Sourcing with an operational check",
    description:
      "Review product availability, parcel fit and fulfillment needs before committing to a selling plan.",
  },
  {
    icon: Workflow,
    title: "One connected order journey",
    description:
      "Coordinate order receipt, packing, dispatch, delivery status and COD information through an agreed process.",
  },
  {
    icon: BadgeDollarSign,
    title: "Models for different cash flows",
    description:
      "Discuss dropshipping, wholesale or stored-inventory options according to your product and growth stage.",
  },
  {
    icon: ShieldCheck,
    title: "Clear terms before launch",
    description:
      "Confirm product, stock, delivery area, rates and return treatment before accepting customer orders.",
  },
  {
    icon: Headset,
    title: "Direct seller support",
    description:
      "Speak with the BloomPath team about products, inventory planning and the right operational next step.",
  },
];

export default function WhyChoose() {
  return (
    <section id="about" className="bg-white py-16 sm:py-24">
      <div className="bp-container">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="bp-eyebrow text-brand-900">Why BloomPath</p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
              Built for sellers who need clarity behind the sale.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end">
            We focus on the parts that turn a product idea into a repeatable UAE
            order operation—stock, handover, packing, dispatch and status
            visibility.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[1.5rem] border border-line sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className="group border-b border-line p-6 transition hover:bg-sand-100 sm:border-r sm:p-7 [&:nth-last-child(-n+1)]:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0 lg:[&:nth-child(3n)]:border-r-0"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-900 transition group-hover:bg-brand-900 group-hover:text-white">
                  <Icon size={21} />
                </span>
                <h3 className="mt-5 text-lg font-black leading-6 text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

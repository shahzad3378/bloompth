import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Can I source products without holding my own stock?",
    answer:
      "You can discuss products that are already available through BloomPath and an order-processing model that fits your sales channel. Availability, quantity and fulfillment terms are confirmed before you list a product.",
  },
  {
    question: "Which selling channels can BloomPath support?",
    answer:
      "BloomPath can coordinate orders from supported ecommerce and social selling channels. The exact handover method depends on the channel, destination and order volume.",
  },
  {
    question: "Does BloomPath offer Cash on Delivery support?",
    answer:
      "COD availability depends on the destination and selected delivery partner. Delivery areas, charges, return handling and reconciliation terms are confirmed for each seller setup.",
  },
  {
    question: "Can I store my own products near my customers?",
    answer:
      "Yes, warehousing and fulfillment support can be discussed for suitable products. BloomPath will review the product type, quantity, storage requirements, expected order volume and handling needs.",
  },
  {
    question: "How do I get product and delivery pricing?",
    answer:
      "Create a seller account or contact BloomPath with the product, expected quantity, stock location and destination. Product prices are protected for verified sellers; delivery and fulfillment terms are quoted for the selected route.",
  },
  {
    question: "Do I need a business licence to sell?",
    answer:
      "Licensing, product-approval and tax requirements depend on the product, source country, destination market and business structure. Confirm requirements with the relevant authorities or a qualified adviser before shipping.",
  },
];

export default function UaeFaq() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="bp-container grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-900">
            <HelpCircle size={23} />
          </div>
          <p className="bp-eyebrow mt-6 text-brand-900">Common questions</p>
          <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
            Clear answers before you start.
          </h2>
          <p className="mt-5 max-w-md text-base leading-8 text-muted">
            Every seller setup is different. These answers explain the standard
            BloomPath approach; product and service terms are confirmed before
            onboarding.
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left text-base font-black text-ink marker:content-none sm:text-lg">
                {faq.question}
                <ChevronDown
                  size={20}
                  className="shrink-0 text-brand-900 transition group-open:rotate-180"
                />
              </summary>
              <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-muted sm:text-base sm:leading-8">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

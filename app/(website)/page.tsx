import Link from "next/link";
import {
  ArrowUpRight,
  PackageSearch,
  Warehouse,
  Boxes,
  ArrowRight,
  Globe2,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
export const metadata = {
  title: "Product Sourcing, Wholesale & Fulfillment in UAE and Canada",
  description:
    "Source products worldwide, explore wholesale stock and arrange warehousing and fulfillment in the UAE and Canada. Request a quote from BloomPath.",
};
const offers = [
  {
    icon: PackageSearch,
    title: "Find a product or supplier",
    tag: "PRODUCT SOURCING",
    text: "Tell us what you need. We help source products worldwide for personal use, trading and online businesses.",
    href: "/global-sourcing",
    link: "Explore sourcing",
  },
  {
    icon: Boxes,
    title: "Buy stock for your business",
    tag: "WHOLESALE & LIQUIDATION",
    text: "Explore wholesale supply and ask about liquidation stock from the USA, Canada and UAE. Availability and condition are confirmed before purchase.",
    href: "/products",
    link: "Browse available products",
  },
  {
    icon: Warehouse,
    title: "Store, pack and fulfill orders",
    tag: "UAE & CANADA FULFILLMENT",
    text: "Coordinate inventory storage, picking, packing and delivery support. Share your order volume and destinations for a tailored quote.",
    href: "/dropshipping-uae",
    link: "Explore fulfillment",
  },
];
export default function Home() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#eef6fc]">
        <div className="bp-container grid gap-10 py-12 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-800">
              BLOOMPATH · SOURCING & FULFILLMENT
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.07] tracking-tight text-[#102b42] sm:text-6xl">
              Source products worldwide.
              <br />
              <span className="text-blue-800">
                Fulfill in UAE
                <br className="hidden lg:block" /> & Canada.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              From finding the right product to storing stock and sending
              orders, BloomPath helps buyers, traders and online sellers take
              the next step.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#get-quote"
                className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white hover:bg-blue-900"
              >
                Get a quote <ArrowRight size={18} />
              </a>
              <a
                href="#services"
                className="inline-flex min-h-12 items-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold hover:bg-slate-50"
              >
                Find your service
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-600">
              Worldwide sourcing · UAE & Canada operations · Personal & business
              inquiries
            </p>
          </div>
          <div className="rounded-3xl bg-[#123b57] p-6 text-white sm:p-9">
            <Globe2 size={32} className="text-sky-300" />
            <h2 className="mt-5 text-2xl font-bold">What brings you here?</h2>
            <p className="mt-2 text-sm leading-6 text-sky-100">
              Choose your goal. We will help you work out the details.
            </p>
            <div className="mt-6 space-y-3">
              {offers.map((o) => (
                <a
                  key={o.tag}
                  href="#get-quote"
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-4 font-bold hover:bg-white/15"
                >
                  <span className="flex items-center gap-3">
                    <o.icon size={21} />
                    {o.title}
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-sky-100">
              Not sure? Use the website chat. No phone number needed.
            </p>
          </div>
        </div>
      </section>
      <section id="services" className="bp-container py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-800">
          ONE PARTNER, THREE WAYS TO START
        </p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
          A clear route for your next move.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {offers.map((o) => (
            <article
              key={o.tag}
              className="flex flex-col rounded-2xl border border-slate-200 p-6"
            >
              <o.icon size={28} className="text-blue-800" />
              <p className="mt-6 text-xs font-bold tracking-wider text-blue-800">
                {o.tag}
              </p>
              <h3 className="mt-3 text-2xl font-bold">{o.title}</h3>
              <p className="mt-4 flex-1 leading-7 text-slate-600">{o.text}</p>
              <Link
                href={o.href}
                className="mt-6 inline-flex items-center gap-2 font-bold text-blue-800 hover:underline"
              >
                {o.link}
                <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 py-14">
        <div className="bp-container">
          <h2 className="text-3xl font-black">
            From your requirement to a clear quote.
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              [
                "Share your requirement",
                "Product, quantity, service and destination. Start with a short form or a chat.",
              ],
              [
                "Review the options",
                "Our team confirms availability, service scope, product costs and delivery charges.",
              ],
              [
                "Agree the next step",
                "Proceed only after the details are clear. Stock, timelines and terms depend on your request.",
              ],
            ].map(([h, p], i) => (
              <li key={h}>
                <span className="font-mono text-sm text-blue-800">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold">{h}</h3>
                <p className="mt-3 leading-7 text-slate-600">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section
        id="get-quote"
        className="bp-container grid gap-9 py-14 sm:py-20 lg:grid-cols-2"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-800">
            LET’S WORK OUT YOUR REQUIREMENT
          </p>
          <h2 className="mt-4 text-3xl font-black sm:text-5xl">
            Your next step starts
            <br />
            with a conversation.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
            Buying stock? Looking for a supplier? Need someone to store and
            fulfill orders? Send us the details and the team will review your
            request.
          </p>
          <p className="mt-5 max-w-md leading-7 text-slate-600">
            Already know which product you want?{" "}
            <Link
              className="font-bold text-blue-800 underline"
              href="/products"
            >
              Browse the catalogue
            </Link>{" "}
            or request a custom product.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 font-bold text-blue-800"
          >
            Contact details <ArrowUpRight size={17} />
          </Link>
        </div>
        <LeadForm />
      </section>
      <section className="bp-container pb-16">
        <h2 className="text-2xl font-bold">Before you get started</h2>
        {[
          [
            "Can I source a product that is not listed?",
            "Yes. Share a description, quantity and destination in the quote form or chat. The team will check sourcing options.",
          ],
          [
            "Do you support both individuals and businesses?",
            "Yes. Tell us whether your requirement is personal, wholesale, trading or online selling so we can assess the right options.",
          ],
          [
            "Are prices and delivery times guaranteed?",
            "No. Product availability, scope, shipping, customs and delivery timelines are confirmed for each quote before you proceed.",
          ],
        ].map(([q, a]) => (
          <details
            key={q}
            className="mt-4 rounded-xl border border-slate-200 px-5 py-4"
          >
            <summary className="cursor-pointer font-bold">{q}</summary>
            <p className="mt-3 leading-7 text-slate-600">{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}

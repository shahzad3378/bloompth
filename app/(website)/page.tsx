import Link from "next/link";
import {
  ArrowUpRight,
  PackageSearch,
  Warehouse,
  Boxes,
  ArrowRight,
  Globe2,
  Truck, Wallet, PackageCheck, ScanBarcode, Plane, Luggage, Container, ShieldCheck, BadgeDollarSign, MonitorSmartphone, Network, BarChart3, MapPin, Store, CheckCircle2,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
export const metadata = {
  title: "Global Fulfillment, Sourcing, Logistics & Technology | BloomPath",
  description:
    "BloomPath offers 10,000 orders/day handling capacity, international fulfillment, product sourcing, COD, DDP and technology-driven logistics across the Middle East, South Asia, USA and Canada.",
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
              You Sell. We Source.
              <br />
              <span className="text-blue-800">We Fulfill. We Deliver.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              From product sourcing and warehousing to picking, packing, delivery and COD collection, BloomPath connects your business to international logistics through our own technology-driven platform.
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
              10,000 orders/day handling capacity · Global logistics network · Own logistics technology
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

      {/* New homepage service banners: existing navigation, catalogue and lead form remain unchanged. */}
      <section className="border-y border-blue-100 bg-[#eaf4fc] py-14 sm:py-20">
        <div className="bp-container">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-800">BUILT TO SCALE WITH YOUR BUSINESS</p>
          <h2 className="mt-3 text-3xl font-black text-[#102b42] sm:text-4xl">Global logistics. Serious fulfillment capacity.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 shadow-sm"><p className="text-4xl font-black text-blue-800">10,000</p><h3 className="mt-2 font-bold">Orders per day</h3><p className="mt-2 text-sm text-slate-600">Actual daily order handling capacity — not a claim of daily completed volume.</p></div>
            <div className="rounded-2xl bg-white p-7 shadow-sm"><Globe2 className="text-blue-800" size={34}/><h3 className="mt-4 font-bold">International logistics network</h3><p className="mt-2 text-sm text-slate-600">Middle East, Pakistan, India, Nepal, Bangladesh, United States and Canada.</p></div>
            <div className="rounded-2xl bg-white p-7 shadow-sm"><MonitorSmartphone className="text-blue-800" size={34}/><h3 className="mt-4 font-bold">Powered by our own technology</h3><p className="mt-2 text-sm text-slate-600">Connected tools for inventory, fulfillment, shipments, tracking and reporting.</p></div>
          </div>
        </div>
      </section>
      <section className="bp-container py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-800">ONE PARTNER. END-TO-END SUPPORT.</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">You sell. We arrange everything.</h2>
        <p className="mt-4 max-w-3xl text-slate-600">Focus on finding customers and growing sales. BloomPath helps arrange products, storage, picking, packing, delivery and cash-on-delivery collection.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {icon:PackageSearch,title:"Personal & product sourcing",image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",text:"Supplier coordination and product sourcing tailored to your needs."},
            {icon:Warehouse,title:"Storage & inventory",image:"https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",text:"Stock receiving, organized storage and inventory visibility."},
            {icon:ScanBarcode,title:"Picking & packing",image:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80",text:"Order picking, careful packing and dispatch preparation."},
            {icon:Truck,title:"Last-mile delivery",image:"https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",text:"Delivery coordination with tracking and status visibility."},
            {icon:Wallet,title:"COD collection",image:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",text:"Cash-on-delivery collection, reconciliation and agreed settlement schedules."},
            {icon:BarChart3,title:"Grow your sales",image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",text:"Spend more time marketing while we coordinate logistics."}
          ].map(item=><article key={item.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={item.image} alt={`${item.title} illustrative service photo`} loading="lazy" className="h-44 w-full object-cover" /><div className="p-6"><item.icon size={30} className="text-blue-800"/><h3 className="mt-4 text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div></article>)}
        </div>
        <a href="#get-quote" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-6 py-3 font-bold text-white hover:bg-blue-900">Request fulfillment quote <ArrowRight size={18}/></a>
      </section>
      <section className="bg-[#102b42] py-14 text-white sm:py-20">
        <div className="bp-container">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-300">BLOOMPATH TECHNOLOGY ECOSYSTEM</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Our own logistics software. Your operations in focus.</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-200">Our in-house logistics management platform connects shipment creation, warehouse workflows, fulfillment orders, inventory visibility, tracking and multi-carrier shipping integrations. Features are available according to the enabled service and operational setup.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {icon:MonitorSmartphone,title:"Logistics dashboard",text:"Shipment and operational visibility"},
              {icon:Warehouse,title:"Warehouse & inventory",text:"Stock, scanning and fulfillment workflows"},
              {icon:Network,title:"Multi-carrier connectivity",text:"Connected shipping integrations"},
              {icon:MapPin,title:"Tracking & reporting",text:"Shipment milestones and reports"}
            ].map(item=><div key={item.title} className="rounded-2xl border border-white/20 bg-white/10 p-6"><item.icon className="text-sky-300" size={30}/><h3 className="mt-4 font-bold">{item.title}</h3><p className="mt-2 text-sm text-slate-200">{item.text}</p></div>)}
          </div>
        </div>
      </section>
      <section className="bp-container py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-800">INTERNATIONAL LOGISTICS</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Across borders. Connected solutions.</h2>
        <p className="mt-4 max-w-3xl text-slate-600">Flexible sourcing, shipment coordination and fulfillment solutions serving businesses across the Middle East, Pakistan, India, Nepal, Bangladesh, the United States and Canada. Service availability depends on route and shipment requirements.</p>
        <div className="mt-7 flex flex-wrap gap-3">{["Middle East","Pakistan","India","Nepal","Bangladesh","United States","Canada"].map(place=><span key={place} className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">{place}</span>)}</div>
        <div className="mt-8 rounded-2xl border border-blue-100 bg-[#eef6fc] p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-800">CANADA FULFILLMENT</p>
          <h3 className="mt-2 text-2xl font-black">Canada logistics in collaboration with FastDrop Worldwide Logistics Inc.</h3>
          <p className="mt-3 leading-7 text-slate-600">BloomPath coordinates Canada-focused fulfillment, commercial shipments, customs support and domestic delivery solutions in collaboration with FastDrop Worldwide Logistics Inc., with access to supported carrier networks.</p>
        </div>
      </section>
      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="bp-container">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-800">FLEXIBLE SERVICES FOR INDIVIDUALS & BUSINESSES</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">More than fulfillment.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {icon:PackageSearch,title:"Personal sourcing",image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",text:"Custom product requests, supplier sourcing and procurement coordination."},
              {icon:Luggage,title:"Personal baggage handling",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",text:"Personal effects, excess baggage and relocation shipment support."},
              {icon:Container,title:"Commercial shipments",image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",text:"Commercial cargo, air freight, import/export and documentation coordination."},
              {icon:Plane,title:"DDP shipping solutions",image:"https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80",text:"Duties-paid cross-border options on eligible routes and shipments."},
              {icon:Wallet,title:"COD management",image:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",text:"Payment collection reporting, reconciliation and agreed settlement cycles."},
              {icon:ShieldCheck,title:"Quality, flexibility & value",image:"https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",text:"Careful handling, reasonable quotations and flexible volume-based solutions."}
            ].map(item=><article key={item.title} className="overflow-hidden rounded-2xl bg-white shadow-sm"><img src={item.image} alt={`${item.title} illustrative service photo`} loading="lazy" className="h-44 w-full object-cover" /><div className="p-6"><item.icon className="text-blue-800" size={30}/><h3 className="mt-4 text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></div></article>)}
          </div>
        </div>
      </section>
      <section className="bp-container py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-800">HAPPY FULFILLMENT CUSTOMERS</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Businesses we are proud to support.</h2>
        <p className="mt-4 text-slate-600">Long-term relationships built on responsive service, careful handling and practical logistics support.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Royal Blunts","Pakistan"],["Shifa Mart","UAE"],["Quickmart","UAE"],["Discount Hub","UAE"]].map(([name,country])=><div key={name} className="rounded-2xl border border-slate-200 p-6"><Store className="text-blue-800" size={30}/><h3 className="mt-4 text-lg font-bold">{name}</h3><p className="mt-1 text-sm text-slate-600">{country}</p></div>)}
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

import Link from "next/link";

const steps = [
  { number: "01", title: "Tell us what you need", text: "Share the product, quantity, preferred origin market and destination. Our team reviews the request with you." },
  { number: "02", title: "Review sourcing options", text: "Compare available supplier, stock and fulfillment options with a quote prepared for your route." },
  { number: "03", title: "Choose fulfillment", text: "Select the service that fits: B2B, B2C, C2C or B2B2C, with last-mile support where available." },
  { number: "04", title: "Track delivery to destination", text: "We coordinate the agreed logistics and keep you informed as the shipment moves through its route." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-blue-100 bg-sky-50">
        <div className="bp-container py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">From any market to your destination</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Global sourcing, made clear at every step.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Tell us what you need and where it should go. BloomPath helps coordinate product sourcing and fulfillment across markets.</p>
        </div>
      </section>
      <section className="bp-container py-16 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {steps.map((step, index) => <article key={step.number} className={`rounded-2xl border p-7 sm:p-9 ${index === 1 ? "border-red-100 bg-red-50/60" : index === 2 ? "border-blue-100 bg-blue-50/70" : "border-slate-200 bg-white"}`}>
            <span className="text-sm font-bold text-red-600">{step.number}</span>
            <h2 className="mt-5 text-2xl font-semibold">{step.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
          </article>)}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/request-product" className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">Request sourcing</Link>
          <Link href="/global-sourcing" className="rounded-full border border-blue-200 bg-white px-6 py-3 font-semibold text-blue-800 hover:bg-blue-50">Explore global sourcing</Link>
        </div>
        <p className="mt-8 border-l-4 border-red-500 pl-4 text-sm leading-6 text-slate-500">Available services and delivery routes are confirmed in your quote.</p>
      </section>
    </main>
  );
}

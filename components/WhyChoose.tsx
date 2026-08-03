import {
  BadgeDollarSign,
  Banknote,
  Building2,
  Headset,
  PackageSearch,
  ShoppingBag,
  Truck,
  Warehouse,
} from "lucide-react";

const benefits = [
  {
    icon: PackageSearch,
    title: "Fast Product Sourcing",
    description:
      "No need to wait for weeks. Source products faster and launch new listings without long delays.",
  },
  {
    icon: BadgeDollarSign,
    title: "Lower Cost, Higher Margins",
    description:
      "Competitive wholesale pricing and efficient operations help reduce costs and improve profit margins.",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery Support",
    description:
      "Offer COD through available fulfillment partners and reach more customers across supported markets.",
  },
  {
    icon: Truck,
    title: "Middle East Delivery",
    description:
      "Reliable last-mile delivery across the UAE and selected GCC and Middle East destinations.",
  },
  {
    icon: Warehouse,
    title: "UAE Warehousing",
    description:
      "Store inventory locally for quicker processing, faster dispatch and a better customer experience.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace & Social Selling",
    description:
      "Fulfillment support for Amazon, Noon, Shopify, TikTok Shop, Facebook and Instagram sellers.",
  },
  {
    icon: Building2,
    title: "New Seller Support",
    description:
      "Do not have a trade license yet? Contact us to discuss available product-listing and seller-support options.",
  },
  {
    icon: Headset,
    title: "High-Value Business Support",
    description:
      "Get practical support for product selection, inventory planning, fulfillment and business growth.",
  },
];

export default function WhyChoose() {
  return (
    <section id="about" className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 sm:text-sm">
            Why Sellers Choose BloomPath
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            More Than a Supplier — Your Complete eCommerce Growth Partner
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Whether you are launching your first online store or scaling an
            established brand, BloomPath provides fast sourcing, UAE
            warehousing, COD support, marketplace fulfillment and reliable
            last-mile delivery to help you grow across the Middle East.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 transition duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon size={27} strokeWidth={2.2} />
                </div>

                <h3 className="mt-5 text-lg font-black leading-6 text-slate-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
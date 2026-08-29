import { MessageCircle, ShoppingBag, Smartphone, Store } from "lucide-react";

const platforms = [
  { name: "Amazon UAE", icon: ShoppingBag },
  { name: "Noon", icon: Store },
  { name: "Shopify", icon: ShoppingBag },
  { name: "TikTok Shop", icon: Store },
  { name: "Facebook", icon: MessageCircle },
  { name: "Instagram", icon: Smartphone },
];

export default function SellerPlatforms() {
  return (
    <section
      className="border-y border-line bg-sand-100 py-8"
      aria-labelledby="sales-channels-title"
    >
      <div className="bp-container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="shrink-0">
          <p id="sales-channels-title" className="text-sm font-black text-ink">
            Built around the channels UAE sellers use
          </p>
          <p className="mt-1 text-xs text-muted">
            Connect the sales flow that suits your business.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-end">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <li
                key={platform.name}
                className="flex items-center gap-2 rounded-xl border border-brand-900/10 bg-white px-3 py-2.5 text-xs font-black text-brand-900 shadow-sm"
              >
                <Icon size={15} />
                {platform.name}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

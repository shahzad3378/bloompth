export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  tone: "forest" | "mint" | "sand";
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-dropshipping-in-uae",
    title: "How to Start Dropshipping in the UAE: An Operations-First Guide",
    excerpt:
      "A practical framework for choosing products, setting up your order flow and preparing UAE fulfillment before spending heavily on ads.",
    category: "Starting a Business",
    publishedAt: "2026-08-28",
    readTime: "7 min read",
    featured: true,
    tone: "forest",
    sections: [
      {
        heading: "Start with the operating model, not the store theme",
        paragraphs: [
          "A dropshipping business is not only a product page and an advertising campaign. It is a chain of decisions: where the product is stored, how an order reaches the operations team, who confirms the customer, how the parcel is packed, which courier receives it and how delivery or return status comes back to you.",
          "Map that chain before launch. A simple, reliable process with one tested product is more useful than a beautiful store with ten products and no clear order ownership.",
        ],
      },
      {
        heading: "Build a UAE product shortlist",
        paragraphs: [
          "Look for products that are easy to explain in a short video, solve a visible problem and can survive normal parcel handling. Confirm the landed product cost, packaging dimensions, stock availability and any restrictions before building an advertisement around it.",
        ],
        bullets: [
          "Clear customer problem and simple demonstration",
          "Enough selling-price room for ads, fulfillment and returns",
          "Practical size, weight and packaging",
          "Reliable UAE stock or replenishment plan",
          "No unverified medical, performance or compliance claims",
        ],
      },
      {
        heading: "Define the order handover",
        paragraphs: [
          "Decide how confirmed orders will reach your fulfillment partner. Early-stage sellers may use an agreed spreadsheet or manual upload. Growing stores usually need a repeatable export or integration. In both cases, customer name, mobile number, complete address, city, product, quantity and COD amount must be consistent.",
          "Also define the cutoff time, duplicate-order check and the person responsible for correcting incomplete addresses.",
        ],
      },
      {
        heading: "Launch with a small learning budget",
        paragraphs: [
          "Treat the first orders as a controlled test. Review confirmation rate, dispatch time, delivered rate, return reasons and customer questions. Improve the offer and operations together before increasing ad spend.",
          "Business licensing, product approvals, tax and marketplace requirements depend on what you sell and how your company is structured. Verify the current rules with the relevant UAE authority or a qualified adviser before launch.",
        ],
      },
    ],
  },
  {
    slug: "uae-cod-fulfillment-guide",
    title: "UAE COD Fulfillment: What Sellers Should Set Up Before Launch",
    excerpt:
      "Understand the operational controls behind cash-on-delivery orders, from confirmation and packing to status reconciliation.",
    category: "COD Operations",
    publishedAt: "2026-08-24",
    readTime: "6 min read",
    featured: true,
    tone: "mint",
    sections: [
      {
        heading: "COD creates a second workflow",
        paragraphs: [
          "With prepaid orders, payment is usually confirmed before fulfillment begins. COD orders introduce another layer: the order can be placed without payment, the customer may need confirmation and cash collection must later be matched with the correct delivered shipment.",
          "That means sellers need both a delivery workflow and a COD reconciliation workflow.",
        ],
      },
      {
        heading: "Set a confirmation policy",
        paragraphs: [
          "Define which orders require a call or WhatsApp confirmation and what happens when the customer does not respond. Record confirmation outcomes instead of repeatedly calling without a status.",
        ],
        bullets: [
          "Confirmed and ready to dispatch",
          "Address or product correction required",
          "Customer requested a later date",
          "No response after the agreed attempts",
          "Customer cancelled before dispatch",
        ],
      },
      {
        heading: "Keep shipment and money records aligned",
        paragraphs: [
          "Each order should retain one stable reference from creation to delivery. Delivery charges, COD amount, return status and any adjustment should be traceable against that reference. A payout total without shipment-level detail is difficult to audit.",
          "Agree how frequently delivery status and COD statements will be shared, and who raises a discrepancy.",
        ],
      },
      {
        heading: "Review reasons, not only totals",
        paragraphs: [
          "A high return count does not explain the problem. Break it down by no answer, incorrect address, customer refusal, reschedule, product expectation or operational delay. The reason determines whether you should change the advertisement, confirmation script, product page or delivery workflow.",
        ],
      },
    ],
  },
  {
    slug: "choose-products-for-uae-online-store",
    title: "A 7-Point Scorecard for Choosing Products to Sell in the UAE",
    excerpt:
      "Use a repeatable product-selection scorecard instead of choosing stock only because a competitor is advertising it.",
    category: "Product Sourcing",
    publishedAt: "2026-08-19",
    readTime: "5 min read",
    featured: true,
    tone: "sand",
    sections: [
      {
        heading: "A trending product is a signal, not a decision",
        paragraphs: [
          "Competitor ads and public sold counters can help you discover demand, but they do not reveal the advertiser's real delivery rate, refund rate, product cost or net profit. Use them to build a shortlist, then score the business case yourself.",
        ],
      },
      {
        heading: "Score every candidate from one to five",
        paragraphs: [
          "Use the same questions for every product. A consistent scorecard prevents excitement about one feature from hiding operational problems.",
        ],
        bullets: [
          "Problem clarity: can the benefit be understood quickly?",
          "Demonstration: does the product work well in video?",
          "Margin room: can the price absorb ads and fulfillment?",
          "Parcel fit: is it easy to store, pack and deliver?",
          "Quality risk: how likely is damage or disappointment?",
          "Supply: can stock be replenished reliably?",
          "Compliance: are claims, labels and approvals understood?",
        ],
      },
      {
        heading: "Test the offer, not only the item",
        paragraphs: [
          "The same product can perform differently with a clearer bundle, stronger instructions, better creative or a more realistic promise. Keep the first test small enough that you can change the offer without being trapped by excess stock.",
        ],
      },
      {
        heading: "Protect the delivered-order margin",
        paragraphs: [
          "Build your calculation around delivered orders, while still accounting for the cost created by cancelled and returned orders. Include product, packaging, confirmation, fulfillment, delivery, advertising and expected return exposure before approving the selling price.",
        ],
      },
    ],
  },
  {
    slug: "uae-warehouse-vs-overseas-shipping",
    title: "UAE Warehousing vs Overseas Shipping: Which Model Fits Your Store?",
    excerpt:
      "Compare local inventory and cross-border dispatch through the lenses of speed, cash flow, control and customer experience.",
    category: "Fulfillment",
    publishedAt: "2026-08-14",
    readTime: "6 min read",
    featured: false,
    tone: "forest",
    sections: [
      {
        heading: "The cheapest unit is not always the cheapest delivered order",
        paragraphs: [
          "Overseas sourcing can reduce product cost at volume, but cross-border dispatch adds lead time, customs uncertainty and a more difficult return path. Local UAE stock uses working capital earlier, but it makes order processing and exception handling easier to control.",
        ],
      },
      {
        heading: "When local stock usually helps",
        paragraphs: [
          "Local warehousing is useful when a product has proven demand, customers expect fast delivery or the seller needs consistent packing and dispatch. It also makes exchanges, quality checks and stock counts easier to coordinate.",
        ],
        bullets: [
          "Repeatable daily or weekly order volume",
          "Need for faster local dispatch",
          "COD or local courier workflow",
          "Bundles, inserts or custom packing",
          "A clear replenishment plan",
        ],
      },
      {
        heading: "When a lighter model may be safer",
        paragraphs: [
          "If demand is not proven, avoid committing to a large local quantity only to reduce unit cost. Start with available stock, a small wholesale batch or an agreed dropshipping model. Move into dedicated inventory when the delivered-order data supports it.",
        ],
      },
      {
        heading: "Use a hybrid decision",
        paragraphs: [
          "Many sellers test with a low-inventory model, hold proven products in the UAE and source the next replenishment in planned batches. The best model can change by product rather than applying one rule to the whole store.",
        ],
      },
    ],
  },
  {
    slug: "one-fulfillment-workflow-multiple-sales-channels",
    title: "One UAE Fulfillment Workflow for Amazon, Noon, Shopify and Social Orders",
    excerpt:
      "Create one operational source of truth even when orders arrive from multiple marketplaces, stores and social channels.",
    category: "Store Operations",
    publishedAt: "2026-08-09",
    readTime: "5 min read",
    featured: false,
    tone: "mint",
    sections: [
      {
        heading: "Channels are different; order controls should be consistent",
        paragraphs: [
          "Marketplaces and direct stores may use different order formats, service levels and customer communication. Your internal shipment record should still use consistent fields and statuses so the team can work without guessing.",
        ],
      },
      {
        heading: "Define the common order record",
        paragraphs: [
          "Keep a channel order number and one internal reference. Store the product SKU, quantity, customer details, payment type, COD value, service level and special packing instructions in predictable fields.",
        ],
        bullets: [
          "Sales channel and channel order number",
          "Internal order or shipment reference",
          "Product SKU and quantity",
          "Complete UAE delivery address",
          "Payment and COD amount",
          "Current operational status",
        ],
      },
      {
        heading: "Separate channel status from warehouse status",
        paragraphs: [
          "A marketplace status such as ready to ship is not always the same as physically packed. Use clear warehouse events—received, allocated, picked, packed and handed over—then update the sales channel according to its own rules.",
        ],
      },
      {
        heading: "Start manual, standardise early",
        paragraphs: [
          "A manual upload can work at low volume if the template and ownership are clear. As volume grows, automation becomes valuable. Standardising fields early makes that later integration much easier.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

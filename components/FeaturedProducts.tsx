const products = [
  {
    name: "Vitamin C Serum",
    wholesalePrice: 16,
    sellingPrice: 32,
    stock: 645,
    icon: "🧴",
  },
  {
    name: "Hair Growth Serum",
    wholesalePrice: 18,
    sellingPrice: 39,
    stock: 560,
    icon: "🧪",
  },
  {
    name: "Electric Kettle",
    wholesalePrice: 35,
    sellingPrice: 65,
    stock: 320,
    icon: "☕",
  },
  {
    name: "Wireless Earbuds",
    wholesalePrice: 28,
    sellingPrice: 55,
    stock: 336,
    icon: "🎧",
  },
];

export default function FeaturedProducts() {
  return (
    <section id="products" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Product Catalogue
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Featured Products
            </h2>
          </div>

          <button className="text-left text-sm font-bold text-emerald-600 sm:text-right">
            View All Products →
          </button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const profit = product.sellingPrice - product.wholesalePrice;
            const margin = Math.round(
              (profit / product.sellingPrice) * 100
            );

            return (
              <article
                key={product.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50 text-7xl">
                  {product.icon}

                  <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    Ready Stock
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-950">
                    {product.name}
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Wholesale Price
                      </p>
                      <p className="mt-1 font-black text-slate-950">
                        AED {product.wholesalePrice.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Suggested Price
                      </p>
                      <p className="mt-1 font-black text-slate-950">
                        AED {product.sellingPrice.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Estimated Profit
                      </p>
                      <p className="mt-1 font-black text-emerald-600">
                        AED {profit.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Profit Margin
                      </p>
                      <p className="mt-1 font-black text-emerald-600">
                        {margin}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-emerald-600">
                      {product.stock} pcs in stock
                    </span>

                    <span className="text-slate-500">
                      Same-day dispatch
                    </span>
                  </div>

                  <button className="mt-5 w-full rounded-lg bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-emerald-600">
                    View Product
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
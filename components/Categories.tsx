const categories = [
  {
    name: "Health & Personal Care",
    icon: "🧴",
    products: "2,500+ Products",
  },
  {
    name: "Beauty",
    icon: "💄",
    products: "1,800+ Products",
  },
  {
    name: "Home & Kitchen",
    icon: "🏠",
    products: "3,200+ Products",
  },
  {
    name: "Mobile Accessories",
    icon: "📱",
    products: "4,000+ Products",
  },
  {
    name: "Electronics",
    icon: "🎧",
    products: "2,100+ Products",
  },
  {
    name: "Fitness",
    icon: "🏋️",
    products: "1,400+ Products",
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="bg-gradient-to-b from-slate-50 to-white py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
            SHOP BY CATEGORY
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900">
            Explore Our Product Categories
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Thousands of ready-stock products available for online sellers.
            Start selling today without investing in inventory.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:shadow-2xl"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl transition group-hover:scale-110">
                {category.icon}
              </div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {category.products}
              </p>

              <button className="mt-6 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
                View Products
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
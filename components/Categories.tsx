const categories = [
  "Health & Personal Care",
  "Beauty",
  "Home & Kitchen",
  "Mobile Accessories",
  "Electronics",
  "Fitness",
];

export default function Categories() {
  return (
    <section id="categories" className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Seller Categories
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Shop Top Categories
            </h2>
          </div>

          <button className="text-left text-sm font-bold text-emerald-600 sm:text-right">
            View All Categories →
          </button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <article
              key={category}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-slate-100 text-4xl transition group-hover:scale-105">
                {index === 0 && "🧴"}
                {index === 1 && "💄"}
                {index === 2 && "🏠"}
                {index === 3 && "📱"}
                {index === 4 && "🎧"}
                {index === 5 && "🏋️"}
              </div>

              <h3 className="mt-5 font-bold text-slate-950">{category}</h3>

              <p className="mt-2 text-sm text-slate-500">
                Ready-stock products
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
const navLinks = [
  { name: "Home", href: "#" },
  { name: "Products", href: "#products" },
  { name: "Categories", href: "#categories" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <>
      <div className="bg-emerald-600 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        Same-Day Dispatch in UAE | Ready Stock | Wholesale Prices | Seller
        Support
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <a href="#" className="shrink-0">
            <div className="text-2xl font-black tracking-wide">
              BLOOM<span className="text-emerald-400">PTH</span>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-400">
              Seller Hub
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="transition hover:text-emerald-400"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden flex-1 justify-center xl:flex">
            <div className="flex w-full max-w-sm overflow-hidden rounded-lg bg-white">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2.5 text-sm text-slate-900 outline-none"
              />
              <button
                type="button"
                className="bg-emerald-500 px-4 font-bold text-white transition hover:bg-emerald-400"
                aria-label="Search"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden text-sm font-semibold transition hover:text-emerald-400 sm:block">
              Login
            </button>

            <button className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400">
              Register
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/20 px-3 py-2 text-xl lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
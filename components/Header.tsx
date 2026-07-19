import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Become a Seller", href: "/become-seller" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <>
      <div className="bg-emerald-600 px-4 py-2 text-center text-xs font-semibold text-white sm:text-sm">
        UAE-ready products for online sellers and dropshipping businesses
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="shrink-0">
            <div className="text-2xl font-black tracking-tight">
              Bloom<span className="text-emerald-400">Path</span>
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Product Sourcing UAE
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-emerald-400"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden rounded-lg border border-white/20 px-4 py-2.5 text-sm font-bold transition hover:border-emerald-400 hover:text-emerald-400 sm:inline-flex"
            >
              Browse Products
            </Link>

            <Link
              href="/contact"
              className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400"
            >
              Contact Us
            </Link>

            <button
              type="button"
              className="rounded-lg border border-white/20 px-3 py-2 text-xl lg:hidden"
              aria-label="Open navigation menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
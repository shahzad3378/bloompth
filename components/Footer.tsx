export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-2xl font-black tracking-wide text-white">
            BLOOM<span className="text-emerald-400">PTH</span>
          </h2>

          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Seller Hub
          </p>

          <p className="mt-5 max-w-sm text-sm leading-7">
            UAE-based wholesale and fulfillment support for online sellers.
            Access ready stock, seller-friendly pricing and faster dispatch.
          </p>
        </div>

        <div>
          <h3 className="font-black text-white">Quick Links</h3>

          <div className="mt-5 space-y-3 text-sm">
            <a href="#" className="block hover:text-emerald-400">
              Home
            </a>
            <a href="#products" className="block hover:text-emerald-400">
              Products
            </a>
            <a href="#categories" className="block hover:text-emerald-400">
              Categories
            </a>
            <a href="#about" className="block hover:text-emerald-400">
              About Us
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-black text-white">Seller Support</h3>

          <div className="mt-5 space-y-3 text-sm">
            <p>Become a Seller</p>
            <p>Shipping & Delivery</p>
            <p>Returns & Refunds</p>
            <p>Product Downloads</p>
            <p>Frequently Asked Questions</p>
          </div>
        </div>

        <div>
          <h3 className="font-black text-white">Contact Us</h3>

          <div className="mt-5 space-y-3 text-sm">
            <p>Dubai, United Arab Emirates</p>
            <p>WhatsApp Seller Support</p>
            <p>support@bloompth.com</p>
            <p>Monday–Saturday, 9 AM–7 PM</p>
          </div>

          <button className="mt-6 rounded-lg bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-400">
            Contact on WhatsApp
          </button>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-center text-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 BLOOMPTH Seller Hub. All rights reserved.</p>

          <div className="flex justify-center gap-5 sm:justify-end">
            <a href="#" className="hover:text-emerald-400">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-white/10 bg-black text-white">
      <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-start lg:justify-between lg:min-h-[60vh]">
        {/* Brand + Story */}
        <div className="max-w-sm space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            Premium Wooden Craft
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            WoodenHive
          </h2>
          <p className="text-sm text-neutral-300">
            Handcrafted wooden furniture and decor made from sustainably
            sourced timber, designed to bring warmth and character to every
            corner of your home.
          </p>
          <div className="flex flex-col gap-3 text-xs text-white">
  <span className="underline underline-offset-4">
    Quality Tested Products
  </span>

  <span className="underline underline-offset-4">
    Secure Payments
  </span>

  <span className="underline underline-offset-4">
    Fast & Reliable Delivery
  </span>
</div>


        </div>

        {/* Navigation Columns */}
        <div className="grid flex-1 gap-y-8 gap-x-16 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-[140px] space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Shop
            </p>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <a href="/shop/home" className="transition hover:text-neutral-100">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop/listing"
                  className="transition hover:text-neutral-100"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href="/shop/account"
                  className="transition hover:text-neutral-100"
                >
                  My Orders
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-[180px] space-y-3 break-words pr-4 leading-relaxed">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Support
            </p>
            <ul className="space-y-2 text-neutral-300">
              <li>Phone: +923003395535</li>
              <li>Email: info@woodenhive.com</li>
            </ul>
          </div>

          <div className="min-w-[150px] space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Policies
            </p>
            <ul className="space-y-2 text-neutral-300">
              <li>Shipping & Returns</li>
              <li>Warranty & Care</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        {/* Newsletter + Social */}
        <div className="max-w-xs space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Stay inspired
          </p>
          <p className="text-sm text-neutral-300">
            Subscribe for styling tips, launch updates, and exclusive
            offers on WoodenHive collections.
          </p>
          <form
            className="flex flex-col gap-3 text-sm sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="h-10 flex-1 rounded-full border border-white/30 bg-white/5 px-3 text-sm text-white placeholder:text-neutral-400 outline-none focus:border-white focus:ring-1 focus:ring-white"
            />
            <button
              type="submit"
              className="h-10 rounded-full bg-white px-4 text-xs font-semibold uppercase tracking-wide text-black shadow-sm transition hover:bg-neutral-200"
            >
              Subscribe
            </button>
          </form>
          <div className="space-y-3 text-xs text-neutral-300">
            <p className="font-medium">Follow WoodenHive</p>
            <div className="flex flex-wrap gap-3">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@woodenhive?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition hover:bg-white hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M15.5 4.5c.5 1.6 1.7 2.8 3.3 3.3v2.2a5.2 5.2 0 0 1-3.3-1.1v5.4A5.4 5.4 0 1 1 10 9.1v2.3a2.9 2.9 0 1 0 2 2.7V4.5h3.5z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@WoodenHive"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition hover:bg-white hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M21 8.3c-.1-.8-.7-1.4-1.4-1.5C18 6.5 15 6.5 12 6.5s-6 0-7.6.3C3.7 7 3.1 7.5 3 8.3 2.8 9.9 2.8 12 3 13.7c.1.8.7 1.4 1.4 1.5 1.6.3 4.6.3 7.6.3s6 0 7.6-.3c.7-.1 1.3-.7 1.4-1.5.2-1.7.2-3.8 0-5.4zM10.5 14V9l4 2.5-4 2.5z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="http://www.linkedin.com/company/wooden-hive/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition hover:bg-white hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M5 4.5a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 5 4.5zM4 9h2v9H4zM10 9h2v1.2A3.1 3.1 0 0 1 14.5 9C17 9 18 10.6 18 13.1V18h-2v-4.4c0-1.3-.5-2.1-1.6-2.1-1 0-1.6.7-1.6 2V18h-2z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/wooden.hive/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition hover:bg-white hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <rect x="4" y="4" width="16" height="16" rx="5" />
                  <circle cx="12" cy="12" r="3.2" />
                  <circle cx="17" cy="7" r="1" fill="currentColor" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://web.facebook.com/profile.php?id=61587652462421"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/5 transition hover:bg-white hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M13 10h2.5l.5-3H13V5.5C13 4.7 13.3 4 14.6 4H16V1.2C15.7 1.1 14.8 1 13.8 1 11.4 1 10 2.6 10 5.2V7H7.5v3H10v9h3v-9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/95">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-4 text-xs text-neutral-400 sm:flex-row sm:justify-between">
          <p>© {year} WoodenHive. All rights reserved.</p>
          <p className="text-[11px]">
            Made with care for modern, sustainable wooden homes.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

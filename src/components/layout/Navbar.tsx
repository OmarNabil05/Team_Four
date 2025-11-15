import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/imgs/logo.png";
import clsx from "clsx";

const links = [
  { label: "الصفحة الرئيسية", to: "/" },
  { label: "مين إحنا", to: "/about" },
  { label: "المنيو", to: "/menu" },
  { label: "الحجز", to: "/reservations" },
  { label: "كلمنا", to: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/5 border-b border-white/10 bg-transparent border-white/10 ">
     
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-10">
<Link to="/" className="flex items-center gap-3">
<div className="flex h-16 w-20 items-center justify-center overflow-hidden">
    <img
      src={logo}
      alt=""
      className="block w-full h-full object-cover"
    />
  </div>
</Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }: { isActive: boolean }) =>
                clsx(
                  "text-lg uppercase tracking-[0.3em] transition hover:text-accent",
                  isActive ? "text-accent" : "text-white/70",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/reservations"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/60 bg-accent/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent shadow-glow-gold transition hover:bg-accent/30"
          >
            احجز دلوقتي
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle Menu</span>
          <div className="space-y-1.5">
            {[0, 1, 2].map((bar) => (
              <span
                key={bar}
                className="block h-0.5 w-6 bg-white transition"
                aria-hidden
              />
            ))}
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <div className="mx-4 mb-6 space-y-4 rounded-3xl bg-nightLight/95 p-6">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }: { isActive: boolean }) =>
                    clsx(
                      "block rounded-full px-4 py-3 text-center text-sm uppercase tracking-[0.3em] transition",
                      isActive
                        ? "bg-accent/20 text-accent"
                        : "text-white/80 hover:bg-white/10",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                <Link
                  to="/reservations"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/60 bg-accent/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent shadow-glow-gold transition hover:bg-accent/30"
                >
                  احجز دلوقتي{" "}
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

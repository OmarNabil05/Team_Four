import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { ThemeToggle } from '../common/ThemeToggle';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Menu', to: '/menu' },
  { label: 'Reservations', to: '/reservations' },
  { label: 'Contact', to: '/contact' },
  { label: 'Admin', to: '/admin' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
            <span className="font-display text-2xl tracking-wider">S</span>
          </div>
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.3em] text-white">Spot</p>
            <p className="text-xs uppercase tracking-[0.4em] text-accent/70">Fine Dining</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }: { isActive: boolean }) =>
                clsx(
                  'text-sm uppercase tracking-[0.3em] transition hover:text-accent',
                  isActive ? 'text-accent' : 'text-white/70',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            to="/reservations"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/60 bg-accent/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent shadow-glow-gold transition hover:bg-accent/30"
          >
            Book a Table
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
                      'block rounded-full px-4 py-3 text-center text-sm uppercase tracking-[0.3em] transition',
                      isActive ? 'bg-accent/20 text-accent' : 'text-white/80 hover:bg-white/10',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                <ThemeToggle />
                <Link
                  to="/reservations"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/60 bg-accent/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent shadow-glow-gold transition hover:bg-accent/30"
                >
                  Book a Table
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

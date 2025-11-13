import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const socials = [
  { name: 'Instagram', href: 'https://instagram.com', handle: '@spot.restaurant' },
  { name: 'Facebook', href: 'https://facebook.com', handle: 'facebook.com/spotrestaurant' },
  { name: 'TikTok', href: 'https://tiktok.com', handle: '@spotrestaurant' },
];

export const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-nightLight/80 py-16">
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-t from-nightLight/70 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-3 lg:px-10">
        <div className="space-y-4">
          <p className="font-display text-3xl uppercase tracking-[0.3em] text-accent">Spot</p>
          <p className="text-sm text-white/60">
            Elevated gastronomy in the heart of the city. Seasonal tasting menus, signature cocktails,
            and bespoke experiences crafted by Chef Adrien Delacroix.
          </p>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">© {new Date().getFullYear()} Spot</p>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Visit</p>
          <p>118 West 56th Street, New York, NY 10019</p>
          <p>Tuesday – Sunday · 5:30 PM – 11:00 PM</p>
          <a href="tel:+12125559819" className="block text-accent transition hover:text-accent/70">
            +1 (212) 555-9819
          </a>
          <a href="mailto:reservations@spotrestaurant.com" className="block text-accent transition hover:text-accent/70">
            reservations@spotrestaurant.com
          </a>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Explore</p>
          <div className="flex flex-col gap-2">
            <Link to="/menu" className="transition hover:text-accent">
              Seasonal Menu
            </Link>
            <Link to="/reservations" className="transition hover:text-accent">
              Private Dining
            </Link>
            <Link to="/about" className="transition hover:text-accent">
              Chef&apos;s Table
            </Link>
          </div>
          <div className="pt-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent/80">Social</p>
            <div className="mt-3 flex flex-col gap-2">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between rounded-full border border-white/10 px-4 py-2 text-white/70 transition hover:border-accent/60 hover:text-accent"
                >
                  <span>{social.name}</span>
                  <span className="text-xs uppercase tracking-[0.2em]">{social.handle}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const socials = [
  { name: "Instagram", href: "https://instagram.com", handle: "@spot.eg" },
  {
    name: "Facebook",
    href: "https://facebook.com",
    handle: "facebook.com/spot.eg",
  },
  { name: "TikTok", href: "https://tiktok.com", handle: "@spot.eg" },
];

export const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-nightLight/80 py-16">
      <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-t from-nightLight/70 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-3 lg:px-10">
        {/* Logo + Description */}
        <div className="space-y-4">
          <p className="font-display text-3xl uppercase tracking-[0.3em] text-accent">
            Spot
          </p>
          <p className="text-sm text-white/60">
            تجربة أكل فاخرة في قلب القاهرة. أطباق موسمية، مكسات مميزة، وتجربة
            مخصوص معمولة بحب.
          </p>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            © {new Date().getFullYear()} Spot Egypt
          </p>
        </div>

        {/* Visit Section */}
        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xl uppercase tracking-[0.3em] text-accent/80">
            زورنا
          </p>
          <p>شارع 26 يوليو، الزمالك، القاهرة</p>
          <p>يومياً · 5:00 مساءً – 12:00 منتصف الليل</p>
          <a
            href="https://wa.me/201234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-accent transition hover:text-accent/70"
            style={{ direction: "ltr", textAlign: "right" }}
          >
            +20 123 456 7890
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=yassminebassem991@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-accent transition hover:text-accent/70"
          >
            reservations@spot-eg.com
          </a>
        </div>

        {/* Explore Section */}
        <div className="space-y-3 text-sm text-white/70">
          <p className="text-xl uppercase tracking-[0.3em] text-accent/80">
            استكشف
          </p>
          <div className="flex flex-col gap-2">
            <Link to="/menu" className="transition hover:text-accent">
              المنيو
            </Link>
            <Link to="/reservations" className="transition hover:text-accent">
              قعدة خاصة
            </Link>
            <Link to="/about" className="transition hover:text-accent">
              ترابيزة الشيف
            </Link>
          </div>

          {/* Social */}
          <div className="pt-4">
            <p className="text-xl uppercase tracking-[0.3em] text-accent/80">
              السوشيال
            </p>
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
                  <span className="text-xs uppercase tracking-[0.2em]">
                    {social.handle}
                  </span>

                  <span>{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

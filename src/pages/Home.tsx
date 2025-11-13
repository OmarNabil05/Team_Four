import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/common/PageTransition';
import { SectionHeading } from '../components/common/SectionHeading';
import type { MenuItem } from '../types';
import { fetchMenu } from '../services/menuService';

const ambianceHighlights = [
  {
    title: 'Culinary Theatre',
    description:
      'Chef Adrien and his brigade craft plates to order in an open hearth kitchen framed by marble and brass.',
  },
  {
    title: 'Sommelier-Curated Cellar',
    description:
      'A library of over 450 labels, including rare vintages and small-batch producers from Burgundy to Yamanashi.',
  },
  {
    title: 'Private Experiences',
    description:
      'Tailored tasting menus and mixology pairings in an intimate ten-seat lounge overlooking the city skyline.',
  },
];

const fallbackFeatured: MenuItem[] = [
  {
    _id: '1',
    title: 'Smoked Wagyu Tenderloin',
    description: 'Miso-glazed wagyu with charred broccolini and black garlic jus.',
    price: 58,
    category: 'Main Courses',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmHuIol1dDL3V43y1l5NcK3_qJeUMZ8Jy02w&s',
    isFeatured: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Truffle Arancini',
    description: 'Crispy risotto spheres with aged parmesan and black truffle aioli.',
    price: 18,
    category: 'Appetizers',
    imageUrl: 'https://www.filippoberio.co.uk/wp-content/uploads/2022/01/truffle-arrancini-recipe.jpg',
    isFeatured: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Dark Chocolate Marquise',
    description: 'Valrhona mousse with burnt orange gel and pistachio praline.',
    price: 16,
    category: 'Desserts',
    imageUrl: 'https://hedgecombers.com/wp-content/uploads/2014/05/Chocolate-Marquise-9898.jpg',
    isFeatured: true,
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const HomePage = () => {
  const [featured, setFeatured] = useState<MenuItem[]>(fallbackFeatured);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menu = await fetchMenu();
        const highlighted = menu.filter((item) => item.isFeatured).slice(0, 4);
        if (highlighted.length) {
          setFeatured(highlighted);
        }
      } catch (error) {
        console.error('Unable to load menu highlights', error);
      }
    };

    void loadMenu();
  }, []);

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-night" />
          <img
            src="https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1600&q=80"
            alt="Spot restaurant interior"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-start justify-center gap-8 px-6 py-32 lg:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs uppercase tracking-[0.5em] text-accent"
          >
            Experience Spot
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-display text-5xl leading-tight tracking-wide text-white sm:text-6xl lg:text-7xl"
          >
            Where Gastronomy Meets Golden Hour Elegance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="max-w-2xl text-lg text-white/70"
          >
            Spot is an ode to modern dining, weaving fire-kissed cuisine, bespoke cocktails, and magnetic
            city energy into every evening. Reserve your moment.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button asChild>
              <Link to="/menu">View Menu</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/reservations">Book a Table</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-6 lg:px-10">
        <div className="glass-sheen rounded-3xl p-8 shadow-2xl sm:p-12">
          <SectionHeading
            eyebrow="Signature Moments"
            title="A destination for celebration, connection, and timeless evenings"
            description="Indulge in tasting menus that evolve with the seasons, cocktails perfumed with house-made bitters, and service that anticipates your desires."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {ambianceHighlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-display text-2xl text-white">{highlight.title}</h3>
                <p className="mt-3 text-sm text-white/60">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Featured Plates"
          title="Our most coveted dishes"
          description="Each dish is artfully plated and finished tableside, highlighting rare ingredients sourced from artisans we trust."
        />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {featured.map((item) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:flex"
            >
              <div className="sm:w-1/2">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-accent/80">{item.category}</span>
                  <span className="font-semibold text-accent">${item.price.toFixed(2)}</span>
                </div>
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="text-sm text-white/65">{item.description}</p>
                <Link
                  to="/menu"
                  className="mt-auto text-sm uppercase tracking-[0.3em] text-accent transition hover:text-accent/70"
                >
                  View full pairing →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-nightLight/30 to-night" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionHeading
              align="left"
              eyebrow="Chef Adrien Delacroix"
              title="Crafting memories beyond the plate"
              description="With a decade at Michelin-starred institutions, Chef Adrien leads Spot with a philosophy rooted in fire, seasonality, and narrative."
            />
            <p className="text-sm text-white/70">
              Our culinary team works in tandem with local farms and global purveyors to deliver produce at its
              peak. Expect five to seven-course tasting journeys, chef&apos;s counter engagements, and rare wine
              pairings guided by our sommeliers.
            </p>
            <Button asChild>
              <Link to="/about">Discover Our Story</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass-sheen overflow-hidden rounded-3xl"
          >
            <img
              src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80"
              alt="Chef plating a dish"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6 lg:px-10">
        <div className="glass-sheen relative overflow-hidden rounded-3xl p-10">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('https://images.unsplash.com/photo-1532634896-26909d0d4b3e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 lg:block" />
          <div className="relative max-w-2xl space-y-6">
            <SectionHeading
              align="left"
              eyebrow="Reserve"
              title="Secure your evening at Spot"
              description="Limited seatings each night ensure every detail receives attention."
            />
            <p className="text-sm text-white/70">
              We accommodate dietary preferences, private events, and curated celebrations. Our concierge will
              confirm every reservation personally.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/reservations">Reserve Now</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/contact">Contact Concierge</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

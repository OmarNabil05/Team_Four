import { motion } from 'framer-motion';
import { PageTransition } from '../components/common/PageTransition';
import { SectionHeading } from '../components/common/SectionHeading';

const milestones = [
  {
    year: '2015',
    title: 'The Vision Awakens',
    description:
      'Chef Adrien Delacroix and beverage director Maya Rivers began curating a culinary salon blending fire-driven cuisine with mixology artistry.',
  },
  {
    year: '2018',
    title: 'Spot Opens Its Doors',
    description:
      'Spot launched in Midtown, unveiling a 50-seat dining room lined with sculpted brass, smoked mirrors, and a live-edge chef’s counter.',
  },
  {
    year: '2022',
    title: 'Michelin Recognition',
    description:
      'Awarded its first Michelin star for a tasting menu celebrating nocturnal botanicals and global spice rituals.',
  },
  {
    year: '2024',
    title: 'The Golden Hour Experience',
    description:
      'Introduced twilight aperitivo pairings, artisan fragrances, and immersive soundscapes curated for each season.',
  },
];

const values = [
  {
    title: 'Seasonality & Story',
    description:
      'Every course evolves with the micro-seasons, sourcing from regenerative farms and coastal fisheries we’ve partnered with for years.',
  },
  {
    title: 'Sustainability with Soul',
    description:
      'Zero-waste cocktail programs, closed-loop kitchen systems, and ethically sourced luxury ingredients define our commitment.',
  },
  {
    title: 'Human-Centered Hospitality',
    description:
      'Our concierge team orchestrates bespoke experiences—from proposal dinners to after-hours jazz—crafted to your narrative.',
  },
];

export const AboutPage = () => {
  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.prismic.io/le-tete-dor/Z09Wl5bqstJ98AEQ_LATETED%E2%80%99OR_MAINDININGROOM_030FINALCreditJasonVarneyforRockwellGroup.jpg?auto=format%2Ccompress&fit=max&w=3840"
            alt="Spot dining room"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-night" />
        </div>
        <div className="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center gap-6 px-6 py-24 lg:px-10">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">Our Story</p>
          <h1 className="font-display text-5xl tracking-wide text-white sm:text-6xl">The Spirit of Spot</h1>
          <p className="max-w-2xl text-base text-white/70">
            Founded by Chef Adrien Delacroix, Spot is a sanctuary for seekers of intimacy, nuance, and sensory
            storytelling. Our dining room hums with the glow of curated jazz vinyl, antique chandeliers, and
            plated dreams.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <SectionHeading
              align="left"
              eyebrow="Philosophy"
              title="Cuisine inspired by twilight, terroir, and texture"
            />
            <p className="text-sm text-white/70">
              At Spot, we compose tasting journeys that elevate familiar comforts into unforgettable crescendos.
              Each plate layers smoke, salt, acid, and aroma to mirror the skyline we overlook. Our pastry lab
              spins sugar into glass, while the bar weaves infused spirits, house bitters, and vintage bubbles.
            </p>
            <p className="text-sm text-white/70">
              Chef Adrien&apos;s devotion to culinary storytelling is matched by our team&apos;s dedication to precision
              and warmth. Every guest is welcomed with a personalized note, and every evening unfolds as a
              cinematic tableau.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass-sheen overflow-hidden rounded-3xl"
          >
            <img
              src="https://cdn-bnklg.nitrocdn.com/WQiharaAoSUWjdmYdQaoZKLXawgJIPOR/assets/images/source/rev-0a84595/www.upmenu.com/wp-content/uploads/2023/10/executive-chef-job-description-cover-photo-1024x731.jpg.webp"
              alt="Chef Adrien"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Milestones"
          title="A timeline of luminous evenings"
          description="From our whispered opening to Michelin acclaim, Spot continues to craft unforgettable narratives."
        />
        <div className="mt-12 space-y-8 border-l border-white/10 pl-6">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="relative pl-6"
            >
              <span className="absolute left-[-0.95rem] top-2 h-3 w-3 rounded-full bg-accent shadow-glow-gold" />
              <p className="text-xs uppercase tracking-[0.3em] text-accent/70">{milestone.year}</p>
              <h3 className="font-display text-2xl text-white">{milestone.title}</h3>
              <p className="text-sm text-white/65">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6 lg:px-10">
        <div className="glass-sheen grid gap-12 rounded-3xl p-10 md:grid-cols-3">
          {values.map((value) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <h3 className="font-display text-2xl text-white">{value.title}</h3>
              <p className="text-sm text-white/65">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};

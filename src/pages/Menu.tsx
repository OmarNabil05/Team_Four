import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { PageTransition } from '../components/common/PageTransition';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/ui/Button';
import type { MenuCategory, MenuItem } from '../types';
import { fetchMenu } from '../services/menuService';

const categoryOrder: MenuCategory[] = ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'];

export const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const items = await fetchMenu();
        setMenu(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };

    void loadMenu();
  }, []);

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') {
      return menu;
    }
    return menu.filter((item) => item.category === activeCategory);
  }, [activeCategory, menu]);

  const groupedMenu = useMemo(() => {
    if (activeCategory !== 'All') {
      return { [activeCategory]: filteredMenu } as Record<MenuCategory, MenuItem[]>;
    }
    return categoryOrder.reduce((acc, category) => {
      acc[category] = filteredMenu.filter((item) => item.category === category);
      return acc;
    }, {} as Record<MenuCategory, MenuItem[]>);
  }, [filteredMenu, activeCategory]);

  return (
    <PageTransition>
<section className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
  <SectionHeading
    eyebrow="قائمة الموسم"
    title="متعة الطعم الفاخر"
    description="كل طبق معمول بعناية من مكونات مميزة، عشان تتاكل وتفضل في ذهنك."
  />


        <div className="mt-10 flex flex-wrap gap-3">
          {(['All', ...categoryOrder] as const).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'primary' : 'outline'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && <p className="mt-10 text-sm text-white/70">Loading menu…</p>}
        {error && !loading && <p className="mt-10 text-sm text-red-400">{error}</p>}

        {!loading && filteredMenu.length === 0 && !error && (
          <p className="mt-10 text-sm text-white/60">No dishes available in this category right now. Please check back soon.</p>
        )}

        <div className="mt-16 space-y-16">
          {Object.entries(groupedMenu).map(([category, items]) => (
            items.length > 0 && (
              <div key={category} className="space-y-8">
                {activeCategory === 'All' && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-accent/80">{category}</p>
                    <h3 className="font-display text-3xl text-white">{category}</h3>
                  </div>
                )}
                <div className="grid gap-8 md:grid-cols-2">
                  {items.map((item) => (
                    <motion.article
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex gap-6 rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <div className="h-32 w-32 overflow-hidden rounded-2xl">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <h4 className="font-display text-xl text-white">{item.title}</h4>
                          <span className="font-semibold text-accent">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-white/60">{item.description}</p>
                        <span
                          className={clsx(
                            'inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em]',
                            item.isAvailable
                              ? 'bg-accent/20 text-accent'
                              : 'bg-red-500/20 text-red-300',
                          )}
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </section>
    </PageTransition>
  );
};

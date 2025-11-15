import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import clsx from 'clsx';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={clsx('max-w-3xl space-y-4', align === 'center' ? 'mx-auto text-center' : '', className)}
    >
      {eyebrow && (
        <p className="text-xl uppercase tracking-[0.3em] text-accent/80">{eyebrow}</p>
      )}
      <h2 className=" text-4xl tracking-wide text-white sm:text-5xl">
        {title}
      </h2>
      {description && <p className="text-lg text-white/70">{description}</p>}
    </motion.div>
  );
};

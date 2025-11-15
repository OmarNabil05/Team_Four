import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const transition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.section
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative"
    >
      {children}
    </motion.section>
  );
};

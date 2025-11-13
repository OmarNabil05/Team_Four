import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const iconVariants = {
  initial: { rotate: 0, opacity: 0 },
  animate: { rotate: 360, opacity: 1 },
};

export const ThemeToggle = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleMode}
      className="rounded-full border border-white/20 bg-white/5 p-3 text-white transition hover:bg-white/10"
      initial="initial"
      animate="animate"
      variants={iconVariants}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3v2M12 19v2M4.22183 5.22183l1.41421 1.41421M18.364 19.364l1.4142 1.4142M3 12h2M19 12h2M5.22183 18.7782l1.41421-1.4142M18.364 4.63604l1.4142-1.41421"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 12.79C19.5371 13.6 17.8677 14 16.2043 13.9573C12.1936 13.855 8.745 10.4064 8.64276 6.39572C8.60002 4.73231 8.99997 3.06289 9.81002 1.6C5.78513 2.9628 3 6.63344 3 11C3 16.5228 7.47715 21 13 21C17.3666 21 21.0372 18.2149 22.4 14.19C21.9268 14.4251 21.4378 14.6273 20.9353 14.7933C20.2737 15.0134 19.5824 15.1544 18.8788 15.2095C18.1751 15.2647 17.4686 15.2336 16.775 15.1174C16.0815 15.0011 15.4106 14.801 14.7779 14.522C14.1452 14.243 13.5576 13.8876 13.0298 13.4666C12.502 13.0456 12.0415 12.5638 11.661 12.0354C11.2805 11.5069 10.9846 10.937 10.782 10.3413C10.5794 9.74566 10.472 9.1293 10.4631 8.50788C10.4542 7.88645 10.5441 7.26577 10.7305 6.66936C10.9168 6.07295 11.1977 5.50914 11.5612 4.99754"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </motion.button>
  );
};

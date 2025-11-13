import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf5f3',
          100: '#f7dfd6',
          200: '#f0c1b0',
          300: '#e5a28a',
          400: '#da866c',
          500: '#c7634a',
          600: '#a24d37',
          700: '#7c3a2a',
          800: '#542519',
          900: '#351611',
        },
        accent: '#c59d5f',
        night: '#0b0d10',
        nightLight: '#15181d',
      },
      fontFamily: {
        display: ['\"Cormorant Garamond\"', 'serif'],
        sans: ['\"Montserrat\"', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 40px rgba(197, 157, 95, 0.35)',
      },
      backgroundImage: {
        'grid-overlay':
          'radial-gradient(circle at center, rgba(197, 157, 95, 0.05) 0, rgba(197, 157, 95, 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [forms],
};

export default config;

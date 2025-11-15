import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'spot-theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const persisted = window.localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (persisted === 'light' || persisted === 'dark') {
      setMode(persisted);
    } else {
      // تنظيف القيم القديمة
      window.localStorage.removeItem('theme');
      window.localStorage.removeItem('darkMode');
    }
  }, []);

  useEffect(() => {
    const body = window.document.body;
    if (mode === 'dark') {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
    window.localStorage.setItem(THEME_KEY, mode);
    
    window.localStorage.removeItem('theme');
    window.localStorage.removeItem('darkMode');
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

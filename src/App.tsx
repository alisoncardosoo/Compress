import { useEffect, useState } from 'react';
import { Home } from './pages/Home';

type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'compress-theme';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const App = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return <Home onToggleTheme={() => setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))} theme={theme} />;
};

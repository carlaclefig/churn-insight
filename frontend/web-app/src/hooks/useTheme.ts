import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

export const useTheme = (): UseThemeReturn => {

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('churn-theme') as Theme) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('churn-theme', theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
};
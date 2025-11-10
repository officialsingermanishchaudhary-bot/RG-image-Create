
import React, { createContext, useState, useEffect } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark

  useEffect(() => {
    // Force dark theme
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    setTheme('dark');
  }, []);

  // Toggle function is now disabled but kept for type compatibility
  const toggleTheme = () => {
    console.log("Theme is locked to dark mode.");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
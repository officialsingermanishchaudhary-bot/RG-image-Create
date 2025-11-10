
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center h-9 w-[72px] rounded-full p-1 transition-colors duration-300 bg-gray-200/70 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandFrom focus:ring-offset-bgLight dark:focus:ring-offset-bgDark"
      aria-label="Toggle theme"
    >
      {/* Sliding thumb */}
      <div
        className={`absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-[36px]' : 'translate-x-0'
        }`}
      />
      {/* Moon Icon */}
      <span className="relative z-10 flex h-7 w-7 items-center justify-center">
        <i data-lucide="moon" className={`h-4 w-4 transition-colors duration-300 ${theme === 'light' ? 'text-brandFrom' : 'text-gray-500'}`}></i>
      </span>
      {/* Sun Icon */}
      <span className="relative z-10 flex h-7 w-7 items-center justify-center">
        <i data-lucide="sun" className={`h-4 w-4 transition-colors duration-300 ${theme === 'dark' ? 'text-yellow-400' : 'text-gray-400'}`}></i>
      </span>
    </button>
  );
};

export default ThemeToggle;
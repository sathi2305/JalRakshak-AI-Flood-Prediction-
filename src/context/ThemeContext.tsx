import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'jai_rakshak_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeToggleButtonProps {
  variant?: 'button' | 'segmented' | 'compact';
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-lg border border-[#D9E6F5] dark:border-[#21436F] bg-[#F3F8FD] dark:bg-[#0E223D] text-xs font-semibold select-none shadow-2xs ${className}`}
        role="group"
        aria-label="Theme mode selector"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
            theme === 'light'
              ? 'bg-white text-[#1769E8] shadow-xs font-bold border border-[#D9E6F5]'
              : 'text-[#5B7395] hover:text-[#142E53] dark:text-[#8AA6C8] dark:hover:text-white'
          }`}
          title="Switch to Light Theme"
        >
          <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : ''}`} />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
            theme === 'dark'
              ? 'bg-[#1769E8] text-white shadow-xs font-bold border border-[#2B7FFF]'
              : 'text-[#5B7395] hover:text-[#142E53] dark:text-[#8AA6C8] dark:hover:text-white'
          }`}
          title="Switch to Dark Theme"
        >
          <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-200 fill-blue-200/20' : ''}`} />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all border ${
          theme === 'dark'
            ? 'bg-[#15345E] text-amber-300 border-[#224A80] hover:bg-[#1C4275]'
            : 'bg-[#15345E] text-[#B2CAE5] border-[#214A82] hover:text-white hover:bg-[#1C3E6B]'
        } ${className}`}
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-300" />
        ) : (
          <Moon className="w-4 h-4 text-[#B2CAE5]" />
        )}
      </button>
    );
  }

  // Default button format: dedicated toggle button with icon & text
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        theme === 'dark'
          ? 'bg-[#15345E] text-white border-[#2A5285] hover:bg-[#1C4576] shadow-2xs'
          : 'bg-[#15345E] text-[#C0D4EC] border-[#224778] hover:text-white hover:bg-[#1B3E6A]'
      } ${className}`}
      title={`Click to switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
      aria-label="Toggle theme"
    >
      <div className="relative flex items-center justify-center">
        {theme === 'dark' ? (
          <Moon className="w-3.5 h-3.5 text-blue-300 fill-blue-400/20" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        )}
      </div>
      <span className="font-medium">
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </span>
      <span
        className={`w-2 h-2 rounded-full ${
          theme === 'dark' ? 'bg-[#00D2FF] shadow-[0_0_6px_#00D2FF]' : 'bg-amber-400'
        }`}
      />
    </button>
  );
};

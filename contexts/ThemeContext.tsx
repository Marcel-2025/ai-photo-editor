import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'cyberpunk';
type PromptStyle = 'default' | 'neon';
type Background = 'default' | 'aurora' | 'particles';


interface ThemeContextType {
  theme: Theme;
  promptStyle: PromptStyle;
  background: Background;
  setTheme: (theme: Theme) => void;
  togglePromptStyle: () => void;
  setBackground: (background: Background) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = 'photo_editor_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [promptStyle, setPromptStyle] = useState<PromptStyle>('neon');
  const [background, setBackgroundState] = useState<Background>('aurora');

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        const { theme: savedTheme, promptStyle: savedPromptStyle, background: savedBackground } = JSON.parse(storedTheme);
        if (savedTheme) setThemeState(savedTheme);
        if (savedPromptStyle) setPromptStyle(savedPromptStyle);
        if (savedBackground) setBackgroundState(savedBackground);
      }
    } catch (error) {
      console.error("Failed to load theme from local storage", error);
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, []);
  
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    const newSettings = { theme: newTheme, promptStyle, background };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newSettings));
  }, [promptStyle, background]);

  const togglePromptStyle = useCallback(() => {
    setPromptStyle(currentStyle => {
        const newStyle = currentStyle === 'default' ? 'neon' : 'default';
        const newSettings = { theme, promptStyle: newStyle, background };
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newSettings));
        return newStyle;
    });
  }, [theme, background]);

  const setBackground = useCallback((newBackground: Background) => {
    setBackgroundState(newBackground);
    const newSettings = { theme, promptStyle, background: newBackground };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newSettings));
  }, [theme, promptStyle]);


  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-cyberpunk');
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, promptStyle, background, setTheme, togglePromptStyle, setBackground }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
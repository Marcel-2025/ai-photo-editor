import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'cyberpunk';
type Background = 'default' | 'aurora' | 'particles';
type PromptStyle = 'default' | 'neon';

export const appIcons = [
    { name: 'Lumina Light', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="white" rx="60"/><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8A2BE2;stop-opacity:1" /><stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" /></linearGradient></defs><path d="M68 60H128V80H88V184H68V60Z" fill="url(#grad1)"/><path d="M128 164C128 141.908 145.908 124 168 124C190.092 124 208 141.908 208 164C208 186.092 190.092 204 168 204C145.908 204 128 186.092 128 164Z" fill="url(#grad1)"/><circle cx="168" cy="164" r="32" fill="#2c3e50"/><circle cx="168" cy="164" r="24" fill="#34495e"/><circle cx="168" cy="164" r="12" fill="#7f8c8d"/><circle cx="168" cy="164" r="6" fill="#bdc3c7"/></svg>` },
    { name: 'Lumina Dark', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#111" rx="60"/><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00F0FF;stop-opacity:1" /><stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" /></linearGradient></defs><path d="M68 60H128V80H88V184H68V60Z" fill="url(#grad2)"/><path d="M128 164C128 141.908 145.908 124 168 124C190.092 124 208 141.908 208 164C208 186.092 190.092 204 168 204C145.908 204 128 186.092 128 164Z" fill="url(#grad2)"/><circle cx="168" cy="164" r="32" fill="#000"/><circle cx="168" cy="164" r="24" fill="#222"/><circle cx="168" cy="164" r="12" fill="#555"/><circle cx="168" cy="164" r="6" fill="#ccc"/></svg>` },
    { name: 'Lumina Aurora', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#1A1A3A" rx="60"/><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFC800"/><stop offset="50%" stop-color="#FF00FF"/><stop offset="100%" stop-color="#00F0FF"/></linearGradient></defs><path d="M68 60H128V80H88V184H68V60Z" fill="url(#grad3)"/><path d="M128 164C128 141.908 145.908 124 168 124C190.092 124 208 141.908 208 164C208 186.092 190.092 204 168 204C145.908 204 128 186.092 128 164Z" fill="url(#grad3)"/><circle cx="168" cy="164" r="32" fill="#111"/><circle cx="168" cy="164" r="24" fill="#000"/><circle cx="168" cy="164" r="12" fill="#444"/><circle cx="168" cy="164" r="6" fill="#aaa"/></svg>` },
    { name: 'Lumina Gold', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#1C1C1C" rx="60"/><path d="M68 60H128V80H88V184H68V60Z" fill="#D4AF37"/><path d="M128 164C128 141.908 145.908 124 168 124C190.092 124 208 141.908 208 164C208 186.092 190.092 204 168 204C145.908 204 128 186.092 128 164Z" fill="#D4AF37"/><circle cx="168" cy="164" r="32" fill="#111"/><circle cx="168" cy="164" r="24" fill="#000"/><circle cx="168" cy="164" r="12" fill="#BF9B30"/><circle cx="168" cy="164" r="6" fill="#FFFDD0"/></svg>` },
    { name: 'Lumina Silver', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#1C1C1C" rx="60"/><path d="M68 60H128V80H88V184H68V60Z" fill="#C0C0C0"/><path d="M128 164C128 141.908 145.908 124 168 124C190.092 124 208 141.908 208 164C208 186.092 190.092 204 168 204C145.908 204 128 186.092 128 164Z" fill="#C0C0C0"/><circle cx="168" cy="164" r="32" fill="#111"/><circle cx="168" cy="164" r="24" fill="#000"/><circle cx="168" cy="164" r="12" fill="#A9A9A9"/><circle cx="168" cy="164" r="6" fill="#F5F5F5"/></svg>` },
    { name: 'Lumina Flare', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#0A0A1A" rx="60"/><defs><linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#4A90E2"/><stop offset="100%" stop-color="#9013FE"/></linearGradient><radialGradient id="grad5" cx="0.8" cy="0.2" r="1"><stop offset="0%" stop-color="#00F0FF" stop-opacity="1"/><stop offset="100%" stop-color="#00F0FF" stop-opacity="0"/></radialGradient></defs><path d="M60 60 L180 60 L180 100 L100 100 L100 200 L60 200 Z" fill="url(#grad4)"/><path d="M100 100 L200 200 L180 220 L80 120 Z" fill="url(#grad5)"/></svg>` },
    { name: 'Lumina Neon', svg: `<svg width="100%" height="100%" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#0A0A1A" rx="60"/><defs><linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00F0FF"/><stop offset="100%" stop-color="#5073E8"/></linearGradient><filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M60 60 L180 60 L180 100 L100 100 L100 200 L60 200 Z" fill="url(#grad6)" filter="url(#neonGlow)"/><path d="M100 100 L200 200 L180 220 L80 120 Z" fill="#00F0FF" opacity="0.3" filter="url(#neonGlow)"/></svg>` },
];


interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  background: Background;
  setBackground: (background: Background) => void;
  promptStyle: PromptStyle;
  togglePromptStyle: () => void;
  appIcon: { name: string; svg: string };
  setAppIcon: (name: string) => void;
  appIcons: { name: string; svg: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'lumina_ai_theme_settings';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [background, setBackgroundState] = useState<Background>('aurora');
  const [promptStyle, setPromptStyle] = useState<PromptStyle>('default');
  const [appIcon, setAppIconState] = useState(appIcons[1]); // Default to 'Lumina Dark'

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedSettings) {
        const { theme, background, promptStyle, appIcon: storedIconName } = JSON.parse(storedSettings);
        if (theme) setThemeState(theme);
        if (background) setBackgroundState(background);
        if (promptStyle) setPromptStyle(promptStyle);
        if (storedIconName) {
            const foundIcon = appIcons.find(icon => icon.name === storedIconName);
            if (foundIcon) setAppIconState(foundIcon);
        }
      } else {
        // For new users, default to light theme and aurora background
        setThemeState('light');
        setBackgroundState('aurora');
      }
    } catch (error) {
      console.error("Failed to load theme settings from local storage", error);
    }
  }, []);

  const persistSettings = (data: object) => {
    try {
      const currentSettings = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || '{}');
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ ...currentSettings, ...data }));
    } catch (error) {
      console.error("Failed to save theme settings to local storage", error);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    persistSettings({ theme: newTheme });
    document.documentElement.className = newTheme;
  };
  
  const setBackground = (newBackground: Background) => {
    setBackgroundState(newBackground);
    persistSettings({ background: newBackground });
  }

  const togglePromptStyle = useCallback(() => {
      setPromptStyle(prev => {
          const newStyle = prev === 'default' ? 'neon' : 'default';
          persistSettings({ promptStyle: newStyle });
          return newStyle;
      });
  }, []);

  const setAppIcon = (name: string) => {
    const newIcon = appIcons.find(icon => icon.name === name);
    if (newIcon) {
        setAppIconState(newIcon);
        persistSettings({ appIcon: name });
    }
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
        const svgBlob = new Blob([appIcon.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        favicon.href = url;
        // Clean up the object URL on unmount
        return () => URL.revokeObjectURL(url);
    }
  }, [appIcon]);

  const value = { theme, setTheme, background, setBackground, promptStyle, togglePromptStyle, appIcon, setAppIcon, appIcons };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
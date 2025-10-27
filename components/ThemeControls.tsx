import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, DesktopIcon } from './IconComponents';

export const ThemeControls: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center p-1 bg-[var(--background-secondary)] rounded-full border border-[var(--border-primary)]">
            <button
                onClick={() => setTheme('light')}
                title="Light Mode"
                className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
                <SunIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('dark')}
                title="Dark Mode"
                className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
                <MoonIcon className="w-4 h-4" />
            </button>
            <button
                onClick={() => setTheme('cyberpunk')}
                title="Cyberpunk Mode"
                className={`p-1.5 rounded-full transition-colors ${theme === 'cyberpunk' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
                <DesktopIcon className="w-4 h-4" />
            </button>
        </div>
    </div>
  );
};

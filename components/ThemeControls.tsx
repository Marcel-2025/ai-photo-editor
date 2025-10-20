import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, DesktopIcon, SparklesIcon } from './IconComponents';

export const ThemeControls: React.FC = () => {
  const { theme, setTheme, promptStyle, togglePromptStyle } = useTheme();

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
        <div className="hidden sm:flex items-center gap-2">
            <label htmlFor="prompt-style-toggle" className="text-sm text-[var(--text-secondary)] cursor-pointer select-none flex items-center gap-1.5" title="Toggle Neon Prompt Styles">
                <SparklesIcon className="w-4 h-4" />
                <span>Neon Prompts</span>
            </label>
            <button
                id="prompt-style-toggle"
                onClick={togglePromptStyle}
                role="switch"
                aria-checked={promptStyle === 'neon'}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] ${
                    promptStyle === 'neon' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-primary)]'
                }`}
            >
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        promptStyle === 'neon' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    </div>
  );
};

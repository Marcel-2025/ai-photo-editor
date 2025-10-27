import React from 'react';
import { ThemeControls } from './ThemeControls';
import { BackgroundControls } from './BackgroundControls';
import { SettingsIcon, SparklesIcon } from './IconComponents';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { promptStyle, togglePromptStyle } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-2">
      <div className="flex items-center justify-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-[var(--accent-primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
      </div>
      <div className="space-y-8">
        <div className="bg-[var(--background-secondary)]/50 backdrop-blur-sm border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 text-center md:text-left">Theme & Appearance</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ThemeControls />
          </div>
        </div>

        <div className="bg-[var(--background-secondary)]/50 backdrop-blur-sm border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 text-center md:text-left">Prompt Style</h2>
            <div className="flex items-center justify-between max-w-sm mx-auto">
                 <label htmlFor="prompt-style-toggle" className="text-lg font-medium text-[var(--text-primary)] cursor-pointer select-none flex items-center gap-3" title="Toggle Neon Prompt Styles">
                    <SparklesIcon className="w-6 h-6 text-purple-400" />
                    <span>Neon Prompts</span>
                </label>
                <button
                    id="prompt-style-toggle"
                    onClick={togglePromptStyle}
                    role="switch"
                    aria-checked={promptStyle === 'neon'}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] ${
                        promptStyle === 'neon' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--border-primary)]'
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            promptStyle === 'neon' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
             <p className="text-sm text-[var(--text-secondary)]/80 mt-3 text-center max-w-sm mx-auto">Toggle to apply a vibrant, glowing neon style to prompt suggestion buttons.</p>
        </div>
        
        <div className="bg-[var(--background-secondary)]/50 backdrop-blur-sm border border-[var(--border-primary)] rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 text-center md:text-left">Background Style</h2>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-[var(--text-secondary)]">Select a dynamic background for the app:</p>
            <BackgroundControls />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { SparklesIcon } from './IconComponents';

export const PromptStyleSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { promptStyle, togglePromptStyle } = useTheme();

  return (
    <button
      onClick={togglePromptStyle}
      title={t('settings.neonPrompts')}
      className={`p-2 rounded-full transition-colors ${
        promptStyle === 'neon'
          ? 'text-purple-400 bg-purple-500/10 ring-1 ring-purple-500'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'
      }`}
    >
      <SparklesIcon className="w-5 h-5" />
    </button>
  );
};

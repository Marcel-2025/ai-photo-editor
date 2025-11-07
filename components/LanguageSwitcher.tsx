import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => changeLanguage('en')} 
        className={`px-3 py-1.5 rounded-md text-sm font-medium ${i18n.language.startsWith('en') ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)]'}`}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('de')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium ${i18n.language.startsWith('de') ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)]'}`}
      >
        DE
      </button>
    </div>
  );
};

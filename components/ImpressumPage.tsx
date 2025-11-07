import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from './IconComponents';

interface ImpressumPageProps {
  onBack: () => void;
}

export const ImpressumPage: React.FC<ImpressumPageProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const renderContent = (baseKey: string) => {
    const content = t(baseKey, { returnObjects: true }) as { heading: string; lines: string[] }[];
    return content.map((item, index) => (
      <div key={index} className="mb-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{item.heading}</h2>
        <div className="text-[var(--text-secondary)] leading-relaxed">
          {item.lines.map((line, lineIndex) => (
            <p key={lineIndex}>{line}</p>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {t('common.back')}
      </button>

      <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">{t('imprintPage.title')}</h1>
        {renderContent('imprintPage.content')}
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from './IconComponents';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const renderContent = (baseKey: string) => {
    // Fix: Cast the result of t() to the expected type to resolve i18next type inference issue.
    const content = t(baseKey, { returnObjects: true }) as { heading?: string; text: string }[];
    return content.map((item, index) => (
      <div key={index} className="mb-6">
        {item.heading && <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{item.heading}</h2>}
        <p className="text-[var(--text-secondary)] leading-relaxed">{item.text}</p>
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
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">{t('privacyPage.title')}</h1>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-8">{t('privacyPage.lastUpdated')}</p>
        {renderContent('privacyPage.content')}
      </div>
    </div>
  );
};
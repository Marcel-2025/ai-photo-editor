import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from './IconComponents';

interface DataDeletionPageProps {
  onBack: () => void;
}

export const DataDeletionPage: React.FC<DataDeletionPageProps> = ({ onBack }) => {
  const { t } = useTranslation();

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
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">{t('dataDeletionPage.title')}</h1>
        <div className="text-[var(--text-secondary)] leading-relaxed space-y-4">
            <p>{t('dataDeletionPage.p1')}</p>
            <p>{t('dataDeletionPage.p2')}</p>
            <p>
                {t('dataDeletionPage.p3')}
                <a href={`mailto:${t('dataDeletionPage.email')}`} className="text-[var(--accent-primary)] hover:underline ml-1">
                    {t('dataDeletionPage.email')}
                </a>.
            </p>
            <p>{t('dataDeletionPage.p4')}</p>
        </div>
      </div>
    </div>
  );
};

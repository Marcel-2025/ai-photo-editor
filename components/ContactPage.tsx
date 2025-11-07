import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, MailIcon } from './IconComponents';

interface ContactPageProps {
  onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
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

      <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 sm:p-10 shadow-lg text-center">
        <MailIcon className="w-16 h-16 text-[var(--accent-primary)] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{t('contactPage.title')}</h1>
        <div className="text-[var(--text-secondary)] leading-relaxed space-y-4 max-w-md mx-auto">
            <p>{t('contactPage.p1')}</p>
            <p>
                {t('contactPage.p2')}
                <a href={`mailto:${t('contactPage.email')}`} className="text-[var(--accent-primary)] hover:underline ml-1">
                    {t('contactPage.email')}
                </a>.
            </p>
        </div>
      </div>
    </div>
  );
};

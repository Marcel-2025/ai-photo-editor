import React from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from './IconComponents';

interface PremiumModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl font-bold">&times;</button>
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-[var(--accent-primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{t('premiumModal.title')}</h2>
          <p className="text-[var(--text-secondary)] mb-6">{t('premiumModal.subtitle')}</p>
          <ul className="text-left text-[var(--text-primary)] space-y-2 mb-8">
            <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('premiumModal.feature1')}</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('premiumModal.feature2')}</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('premiumModal.feature3')}</li>
          </ul>
          <button 
            onClick={onConfirm}
            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {t('premiumModal.purchase')}
          </button>
          <p className="text-xs text-[var(--text-secondary)]/80 mt-4">{t('premiumModal.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
};

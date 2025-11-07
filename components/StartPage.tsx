import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Login } from './Login';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeControls } from './ThemeControls';
import { BackgroundControls } from './BackgroundControls';
import { ImageIcon, VideoIcon } from './IconComponents';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { DataDeletionPage } from './DataDeletionPage';
import { useTheme } from '../contexts/ThemeContext';

export const StartPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState<'main' | 'privacy' | 'dataDeletion'>('main');
  const { appIcons, appIcon } = useTheme();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % appIcons.length);
    }, 3000); // Change icon every 3 seconds
    return () => clearInterval(interval);
  }, [appIcons.length]);

  if (page === 'privacy') {
    return <PrivacyPolicyPage onBack={() => setPage('main')} />;
  }
  if (page === 'dataDeletion') {
    return <DataDeletionPage onBack={() => setPage('main')} />;
  }

  return (
    <>
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 icon-shadow" dangerouslySetInnerHTML={{ __html: appIcon.svg }} />
            <span className="text-xl font-bold text-[var(--text-primary)]">Lumina AI</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeControls />
              <BackgroundControls />
          </div>
        </div>
      </header>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 px-4 pt-20 pb-10 flex-grow">
          <div className="text-center lg:text-left max-w-lg">
             <div className="relative w-40 h-40 mx-auto lg:mx-0 mb-6">
                {appIcons.map((icon, index) => (
                    <div
                    key={icon.name}
                    className={`absolute inset-0 transition-opacity duration-1000 icon-shadow ${index === currentIconIndex ? 'opacity-100' : 'opacity-0'}`}
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                ))}
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent animated-gradient">
                Lumina AI
            </h1>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {t('startPage.mainHeading1')}
              <span className="block">{t('startPage.mainHeading2')}</span>
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              {t('startPage.subheading')}
            </p>
            <div className="mt-8 space-y-4 hidden lg:block">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{t('startPage.feature1Title')}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{t('startPage.feature1Desc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                      <VideoIcon className="w-6 h-6" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{t('startPage.feature2Title')}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {t('startPage.feature2Desc1')}
                        <span className="block">{t('startPage.feature2Desc2')}</span>
                      </p>
                  </div>
                </div>
            </div>
          </div>
          <div className="w-full max-w-md">
              <Login />
          </div>
        </div>
        <footer className="w-full text-center p-4">
            <div className="space-y-2">
                <div className="space-x-4">
                    <button onClick={() => setPage('privacy')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline">
                    {t('footer.privacy')}
                    </button>
                    <button onClick={() => setPage('dataDeletion')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline">
                    {t('footer.dataDeletion')}
                    </button>
                </div>
                <p className="text-xs text-[var(--text-secondary)]/80">{t('footer.copyright')}</p>
            </div>
        </footer>
      </div>
    </>
  );
};
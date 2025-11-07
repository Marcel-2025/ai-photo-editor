import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeControls } from './ThemeControls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BackgroundControls } from './BackgroundControls';
import { PromptStyleSwitcher } from './PromptStyleSwitcher';
import { SettingsIcon, ArrowRightIcon } from './IconComponents';
import { View } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPageProps {
    onNavigate: (view: View) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const { appIcons, appIcon, setAppIcon } = useTheme();

    return (
        <div className="max-w-3xl mx-auto">
             <div className="flex items-center justify-center gap-3 mb-10">
                <SettingsIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('settings.title')}</h1>
            </div>

            <div className="space-y-8">
                <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{t('settings.appearance')}</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[var(--text-primary)]">{t('settings.theme')}</label>
                            <ThemeControls />
                        </div>
                         <div className="flex items-center justify-between">
                            <label className="text-[var(--text-primary)]">{t('settings.backgroundStyle')}</label>
                            <BackgroundControls />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="text-[var(--text-primary)]">{t('settings.neonPrompts')}</label>
                            <PromptStyleSwitcher />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{t('settings.appIcon')}</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                        {appIcons.map((icon) => (
                            <button
                                key={icon.name}
                                onClick={() => setAppIcon(icon.name)}
                                className={`relative rounded-lg p-2 transition-all duration-200 aspect-square flex flex-col items-center justify-center gap-2
                                    ${appIcon.name === icon.name 
                                        ? 'ring-2 ring-offset-2 ring-offset-[var(--background-secondary)] ring-[var(--accent-primary)]' 
                                        : 'bg-[var(--background-tertiary)] hover:bg-[var(--border-primary)]'
                                    }`}
                            >
                                <div dangerouslySetInnerHTML={{ __html: icon.svg }} className="w-16 h-16 icon-shadow" />
                                <span className="text-xs text-center text-[var(--text-secondary)] mt-1">{icon.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-lg">
                     <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{t('settings.language')}</h2>
                    <div className="flex items-center justify-between">
                        <label className="text-[var(--text-primary)]">{t('settings.selectLanguage')}</label>
                        <LanguageSwitcher />
                    </div>
                </div>

                <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl p-6 shadow-lg">
                     <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">{t('settings.legal')}</h2>
                    <div className="space-y-3">
                        <button onClick={() => onNavigate('privacy')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-[var(--border-primary)] transition-colors">
                            <span className="text-[var(--text-primary)]">{t('settings.privacyPolicy')}</span>
                            <ArrowRightIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                        </button>
                        <button onClick={() => onNavigate('dataDeletion')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-[var(--border-primary)] transition-colors">
                             <span className="text-[var(--text-primary)]">{t('settings.dataDeletion')}</span>
                            <ArrowRightIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
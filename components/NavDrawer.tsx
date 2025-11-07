import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageIcon, VideoIcon, HistoryIcon, SettingsIcon, CloseIcon, HomeIcon, UserIcon } from './IconComponents';
import { View } from '../App';
import { useTheme } from '../contexts/ThemeContext';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t } = useTranslation();
  const { appIcon } = useTheme();

  const navItems: { view: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { view: 'feed', label: t('nav.home'), icon: HomeIcon },
    { view: 'imageGenerator', label: t('nav.imageGenerator'), icon: ImageIcon },
    { view: 'videoGenerator', label: t('nav.videoGenerator'), icon: VideoIcon },
    { view: 'history', label: t('nav.history'), icon: HistoryIcon },
    { view: 'profile', label: t('nav.profile'), icon: UserIcon },
    { view: 'settings', label: t('nav.settings'), icon: SettingsIcon },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--background-primary)] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 icon-shadow" dangerouslySetInnerHTML={{ __html: appIcon.svg }} />
              <span className="text-xl font-bold text-[var(--text-primary)]">Lumina AI</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--background-secondary)]">
            <CloseIcon className="w-6 h-6 text-[var(--text-secondary)]" />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.view}>
                <button
                  onClick={() => onNavigate(item.view)}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left text-[var(--text-primary)] hover:bg-[var(--background-secondary)] rounded-md transition-colors"
                >
                  <item.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
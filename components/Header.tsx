import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';
import { ThemeControls } from './ThemeControls';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserIcon, LogoutIcon, SettingsIcon, MenuIcon, ImageIcon, VideoIcon, HistoryIcon, HomeIcon, SearchIcon } from './IconComponents';
import { View } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { PromptStyleSwitcher } from './PromptStyleSwitcher';

interface HeaderProps {
  onNavigate: (view: View) => void;
  currentView: View;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, onMenuClick }) => {
  const { t } = useTranslation();
  const { user, credits, isPremium, logout } = useUser();
  const { appIcon } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const navItems: { view: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
      { view: 'feed', label: t('header.home'), icon: HomeIcon },
      { view: 'imageGenerator', label: t('header.image'), icon: ImageIcon },
      { view: 'videoGenerator', label: t('header.video'), icon: VideoIcon },
      { view: 'history', label: t('header.history'), icon: HistoryIcon },
  ];

  if (!user) return null;

  return (
    <header className="sticky top-0 bg-[var(--background-primary)]/80 backdrop-blur-md border-b border-[var(--border-primary)] z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors p-2 -ml-2"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
             <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('feed')}>
              <div className="w-8 h-8 icon-shadow" dangerouslySetInnerHTML={{ __html: appIcon.svg }} />
              <span className="text-xl font-bold text-[var(--text-primary)] hidden sm:block">Lumina AI</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
                 <button 
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentView === item.view ? 'bg-[var(--background-secondary)] text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </button>
            ))}
            <div className="relative ml-2 hidden lg:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-4 h-4 text-[var(--text-secondary)]" />
              </div>
              <input
                type="text"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-md text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-all"
              />
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2">
                <LanguageSwitcher />
                <PromptStyleSwitcher />
                <ThemeControls />
                <button 
                    onClick={() => onNavigate('settings')}
                    title={t('header.settings')}
                    className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
                >
                    <SettingsIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 text-left p-1 rounded-full hover:bg-[var(--background-secondary)] transition-colors">
                 {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-[var(--border-secondary)]" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-[var(--background-tertiary)] grid place-items-center border-2 border-[var(--border-secondary)]">
                            <UserIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                        </div>
                    )}
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {isPremium ? t('header.premium') : `${credits} ${t('header.credits')}`}
                  </p>
                </div>
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg shadow-2xl z-40 animate-fade-in">
                  <div className="p-2">
                    <div className="px-2 py-2 border-b border-[var(--border-primary)]">
                       <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                       <p className="text-xs text-[var(--text-secondary)]">
                         {isPremium ? t('header.premium') : `${credits} ${t('header.credits')}`}
                       </p>
                    </div>
                     <button onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-2 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--border-primary)] rounded-md transition-colors mt-1">
                      <UserIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                      {t('header.profile')}
                    </button>
                     <button onClick={() => { onNavigate('settings'); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-2 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--border-primary)] rounded-md transition-colors">
                      <SettingsIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                      {t('header.settings')}
                    </button>
                    <button onClick={logout} className="w-full text-left flex items-center gap-3 px-2 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--border-primary)] rounded-md transition-colors">
                      <LogoutIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                      {t('header.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
       <style>{`.animate-fade-in { animation: fadeIn 0.15s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
};
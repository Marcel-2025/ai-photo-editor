import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SparklesIcon, UserIcon, CreditIcon, LogoutIcon, ImageIcon, VideoIcon, MenuIcon } from './IconComponents';
import { PremiumModal } from './PremiumModal';
import { ThemeControls } from './ThemeControls';
import { BackgroundControls } from './BackgroundControls';

type View = 'imageGenerator' | 'videoGenerator' | 'history' | 'dashboard' | 'settings';

interface HeaderProps {
    onNavigate: (view: View) => void;
    currentView: View;
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView, onMenuClick }) => {
  const { user, credits, isPremium, logout, goPremium } = useUser();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <>
      <header className="bg-[var(--background-secondary)]/80 backdrop-blur-sm border-b border-[var(--border-primary)]/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 text-[var(--text-primary)] md:hidden"
              aria-label="Open navigation menu"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
            <button onClick={() => onNavigate('imageGenerator')} className="flex items-center space-x-2 sm:space-x-3 group">
              <SparklesIcon className="w-8 h-8 text-[var(--accent-primary)] group-hover:animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                AI Photo Editor
              </h1>
            </button>
            <div className="hidden md:flex items-center gap-2 border-l border-[var(--border-primary)] ml-3 pl-4">
              <button 
                  onClick={() => onNavigate('imageGenerator')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${currentView === 'imageGenerator' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'}`}
              >
                  <ImageIcon className="w-5 h-5" />
                  Image
              </button>
              <button 
                  onClick={() => onNavigate('videoGenerator')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${currentView === 'videoGenerator' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'}`}
              >
                  <VideoIcon className="w-5 h-5" />
                  Video
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             {user && (
                <>
                  <div className="hidden md:flex items-center gap-2 md:gap-4">
                    <BackgroundControls />
                    <ThemeControls />
                  </div>

                  {!isPremium && (
                    <>
                      <div className="hidden md:flex items-center space-x-2 bg-[var(--background-secondary)] px-3 py-1.5 rounded-full border border-[var(--border-primary)]">
                        <CreditIcon className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold text-[var(--text-primary)]">{credits}</span>
                        <span className="text-[var(--text-secondary)] text-sm hidden sm:inline">Credits</span>
                      </div>
                      <button 
                        onClick={() => setShowPremiumModal(true)}
                        className="bg-yellow-500 text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Go Premium
                      </button>
                    </>
                  )}
                  {isPremium && (
                    <div className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full border border-yellow-500/50">
                        <SparklesIcon className="w-5 h-5" />
                        <span className="font-semibold">Premium</span>
                    </div>
                  )}
                  
                  <button onClick={() => onNavigate('dashboard')} title="My Dashboard" className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'}`}>
                    <UserIcon className="w-6 h-6" />
                    <span className="font-medium hidden sm:inline">{user.name}</span>
                  </button>
                  <button onClick={logout} title="Logout" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] rounded-full transition-colors">
                    <LogoutIcon className="w-6 h-6" />
                  </button>
                </>
             )}
          </div>
        </div>
      </header>
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onConfirm={() => { goPremium(); setShowPremiumModal(false); }} />}
    </>
  );
};

import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SparklesIcon, UserIcon, CreditIcon, LogoutIcon, HistoryIcon } from './IconComponents';
import { PremiumModal } from './PremiumModal';
import { ThemeControls } from './ThemeControls';

interface HeaderProps {
    onNavigate: (view: 'editor' | 'history') => void;
    currentView: 'editor' | 'history';
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const { user, credits, isPremium, logout, goPremium } = useUser();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <>
      <header className="bg-[var(--background-secondary)]/80 backdrop-blur-sm border-b border-[var(--border-primary)]/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => onNavigate('editor')} className="flex items-center space-x-3 group">
            <SparklesIcon className="w-8 h-8 text-[var(--accent-primary)] group-hover:animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              AI Photo Editor
            </h1>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             {user && <ThemeControls /> }
            {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
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
              
               <button 
                onClick={() => onNavigate('history')}
                title="View History"
                className={`p-2 rounded-full transition-colors ${currentView === 'history' ? 'bg-[var(--accent-primary)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'}`}
               >
                <HistoryIcon className="w-6 h-6" />
               </button>

              <div className="flex items-center space-x-2 text-[var(--text-primary)]">
                <UserIcon className="w-6 h-6" />
                <span className="font-medium hidden sm:inline">{user.name}</span>
              </div>
              <button onClick={logout} title="Logout" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] rounded-full transition-colors">
                <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
          )}
          </div>
        </div>
      </header>
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onConfirm={() => { goPremium(); setShowPremiumModal(false); }} />}
    </>
  );
};
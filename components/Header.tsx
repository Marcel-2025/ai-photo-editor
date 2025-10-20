import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { SparklesIcon, UserIcon, CreditIcon, LogoutIcon, HistoryIcon } from './IconComponents';
import { PremiumModal } from './PremiumModal';

interface HeaderProps {
    onNavigate: (view: 'editor' | 'history') => void;
    currentView: 'editor' | 'history';
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const { user, credits, isPremium, logout, goPremium } = useUser();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  return (
    <>
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => onNavigate('editor')} className="flex items-center space-x-3 group">
            <SparklesIcon className="w-8 h-8 text-blue-400 group-hover:animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              AI Photo Editor
            </h1>
          </button>
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isPremium && (
                <>
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
                    <CreditIcon className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-white">{credits}</span>
                    <span className="text-gray-400 text-sm hidden sm:inline">Credits</span>
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
                className={`p-2 rounded-full transition-colors ${currentView === 'history' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
               >
                <HistoryIcon className="w-6 h-6" />
               </button>

              <div className="flex items-center space-x-2 text-gray-300">
                <UserIcon className="w-6 h-6" />
                <span className="font-medium hidden sm:inline">{user.name}</span>
              </div>
              <button onClick={logout} title="Logout" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
                <LogoutIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </header>
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onConfirm={() => { goPremium(); setShowPremiumModal(false); }} />}
    </>
  );
};
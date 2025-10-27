import React from 'react';
import { SparklesIcon, ImageIcon, VideoIcon, HistoryIcon, UserIcon, CloseIcon, SettingsIcon } from './IconComponents';
import { useTheme } from '../contexts/ThemeContext';

type View = 'imageGenerator' | 'videoGenerator' | 'history' | 'dashboard' | 'settings';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

const navItems: { view: View, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: UserIcon },
    { view: 'imageGenerator', label: 'Image Generator', icon: ImageIcon },
    { view: 'videoGenerator', label: 'Video Generator', icon: VideoIcon },
    { view: 'history', label: 'History', icon: HistoryIcon },
    { view: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { theme, background } = useTheme();

  const getBackgroundClass = () => {
      if (theme === 'cyberpunk') return 'cyberpunk-bg-grid';
      if (background === 'aurora') return 'bg-aurora';
      if (background === 'particles') return 'bg-particles';
      return '';
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[var(--background-secondary)] shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${getBackgroundClass()} overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-drawer-title"
      >
        <div className="p-4 flex justify-between items-center border-b border-[var(--border-primary)] relative z-10 bg-[var(--background-secondary)]/80 backdrop-blur-sm">
            <div id="nav-drawer-title" className="flex items-center space-x-2 group">
                <SparklesIcon className="w-7 h-7 text-[var(--accent-primary)]" />
                <h1 className="text-xl font-bold text-[var(--text-primary)]">AI Editor</h1>
            </div>
          <button onClick={onClose} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label="Close navigation menu">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 relative z-10">
          <ul>
            {navItems.map(item => (
              <li key={item.view}>
                <button
                  onClick={() => onNavigate(item.view)}
                  className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
                >
                  <item.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserProvider, useUser } from './contexts/UserContext';
import { History } from './components/History';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { VideoGenerator } from './components/VideoGenerator';
import { NavDrawer } from './components/NavDrawer';
import { SettingsPage } from './components/SettingsPage';
import { ImageGenerator } from './components/ImageGenerator';
import { StartPage } from './components/StartPage';
import { DashboardPage } from './components/DashboardPage';

type View = 'imageGenerator' | 'videoGenerator' | 'history' | 'dashboard' | 'settings';

const AppContent: React.FC = () => {
  const { user } = useUser();
  const { theme, background } = useTheme();
  const [view, setView] = useState<View>('imageGenerator');
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  
   useEffect(() => {
    if (background === 'particles') {
      if ((window as any).particlesJS) {
        (window as any).particlesJS('particles-js', {
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
          },
          interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
          },
          retina_detect: true
        });
      }
    } else {
        const particlesEl = document.getElementById('particles-js');
        if (particlesEl) {
            particlesEl.innerHTML = '';
        }
    }
  }, [background]);

  const getBackgroundClass = () => {
      if (theme === 'cyberpunk') return 'cyberpunk-bg-grid';
      if (background === 'aurora') return 'bg-aurora';
      if (background === 'particles') return 'bg-particles';
      return '';
  }

  const handleNavigate = (targetView: View) => {
    setView(targetView);
    setIsNavDrawerOpen(false);
  };

  if (!user) {
    return <div className={`min-h-screen ${getBackgroundClass()}`}>
        <div id="particles-js"></div>
        <StartPage />
    </div>;
  }
  
  return (
     <div className={`min-h-screen font-sans relative ${getBackgroundClass()}`}>
        <div id="particles-js"></div>
        <NavDrawer 
          isOpen={isNavDrawerOpen} 
          onClose={() => setIsNavDrawerOpen(false)}
          onNavigate={handleNavigate}
        />
        <Header 
          onNavigate={handleNavigate} 
          currentView={view} 
          onMenuClick={() => setIsNavDrawerOpen(true)}
        />
        <main className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
            {view === 'imageGenerator' && <ImageGenerator />}
            {view === 'videoGenerator' && <VideoGenerator />}
            {view === 'history' && <History />}
            {view === 'dashboard' && <DashboardPage />}
            {view === 'settings' && <SettingsPage />}
        </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <UserProvider>
            <AppContent />
        </UserProvider>
    </ThemeProvider>
  );
};

export default App;

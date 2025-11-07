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
import { ProfilePage } from './components/DashboardPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { DataDeletionPage } from './components/DataDeletionPage';
import { FeedPage } from './components/FeedPage';
import { PublicProfilePage } from './components/PublicProfilePage';
import { ImpressumPage } from './components/ImpressumPage';
import { ContactPage } from './components/ContactPage';

export type View = 'imageGenerator' | 'videoGenerator' | 'history' | 'profile' | 'settings' | 'privacy' | 'dataDeletion' | 'feed' | 'publicProfile' | 'impressum' | 'contact';

const AppContent: React.FC = () => {
  const { user } = useUser();
  const { theme, background } = useTheme();
  const [view, setView] = useState<View>('feed');
  const [previousView, setPreviousView] = useState<View>('feed');
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const getBackgroundClass = () => {
      if (theme === 'cyberpunk') return 'cyberpunk-bg-grid';
      if (background === 'aurora') return 'bg-aurora';
      return '';
  }
  
  const isOverlayView = (v: View) => ['privacy', 'dataDeletion', 'publicProfile', 'impressum', 'contact'].includes(v);

  const handleNavigate = (targetView: View) => {
    if (!isOverlayView(view)) {
      setPreviousView(view);
    }
    setView(targetView);
    setIsNavDrawerOpen(false);
  };
  
  const handleViewProfile = (userId: string) => {
    setProfileUserId(userId);
    handleNavigate('publicProfile');
  };
  
  const handleBack = () => {
    if (view === 'publicProfile') {
        setView('feed');
        setProfileUserId(null);
    } else {
        setView(previousView);
    }
  }

  useEffect(() => {
    if (user && view !== 'feed') {
      setView('feed');
    }
    if (!user) {
        setView('imageGenerator'); // Reset to a default view for the start page
    }
  }, [user]);

  if (!user) {
    return <div className={`min-h-screen ${getBackgroundClass()}`}>
        <StartPage />
    </div>;
  }
  
  const renderView = () => {
    switch(view) {
        case 'imageGenerator': return <ImageGenerator />;
        case 'videoGenerator': return <VideoGenerator />;
        case 'history': return <History />;
        case 'profile': return <ProfilePage />;
        case 'settings': return <SettingsPage onNavigate={handleNavigate} />;
        case 'privacy': return <PrivacyPolicyPage onBack={handleBack} />;
        case 'dataDeletion': return <DataDeletionPage onBack={handleBack} />;
        case 'impressum': return <ImpressumPage onBack={handleBack} />;
        case 'contact': return <ContactPage onBack={handleBack} />;
        case 'feed': return <FeedPage onViewProfile={handleViewProfile} />;
        case 'publicProfile': return profileUserId ? <PublicProfilePage userId={profileUserId} onBack={handleBack} onViewProfile={handleViewProfile} /> : <FeedPage onViewProfile={handleViewProfile} />;
        default: return <FeedPage onViewProfile={handleViewProfile}/>;
    }
  }

  return (
     <div className={`min-h-screen font-sans relative ${getBackgroundClass()}`}>
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
        <main className={"container mx-auto px-4 py-6 sm:py-8 relative z-10"}>
            {renderView()}
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
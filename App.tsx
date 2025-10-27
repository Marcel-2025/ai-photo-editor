import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageFile } from './types';
import { editImageWithGemini } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { EditControls } from './components/EditControls';
import { Loader } from './components/Loader';
import { FilterControls, Filter } from './components/FilterControls';
import { AspectRatioControls, AspectRatio } from './components/AspectRatioControls';
import { PaletteIcon, ImageIcon, UserIcon, CreditIcon, SparklesIcon, SaveIcon, PaintBrushIcon, SettingsIcon, ColorfulSparklesIcon, ColorfulSaveIcon, ColorfulHistoryIcon, VideoIcon, EditIcon, UploadIcon } from './components/IconComponents';
import { PromptSuggestions } from './components/PromptSuggestions';

import { UserProvider, useUser } from './contexts/UserContext';
import { Login } from './components/Login';
import { Favorites } from './components/Gallery';
import { PremiumModal } from './components/PremiumModal';
import { VariationsDisplay } from './components/VariationsDisplay';
import { QualityControls, PortraitQuality } from './components/QualityControls';
import { History } from './components/History';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { VideoGenerator } from './components/VideoGenerator';
import { NavDrawer } from './components/NavDrawer';
import { SettingsPage } from './components/SettingsPage';

const FILTERS: Filter[] = [
  { name: 'None', css: 'none' },
  { name: 'Grayscale', css: 'grayscale(100%)' },
  { name: 'Sepia', css: 'sepia(100%)' },
  { name: 'Invert', css: 'invert(100%)' },
  { name: 'Vintage', css: 'sepia(60%) contrast(110%) brightness(90%)' },
  { name: 'Noir', css: 'grayscale(100%) contrast(130%) brightness(90%)' },
];

const ASPECT_RATIOS: AspectRatio[] = [
    { name: 'Square', value: '1:1' },
    { name: 'Landscape', value: '16:9' },
    { name: 'Portrait', value: '9:16' },
];

const QUALITIES: PortraitQuality[] = [
    { name: 'HD (720p)', value: 'hd' },
    { name: 'FHD (1080p)', value: 'fhd' },
];

const PROMPT_SUGGESTIONS: { [category: string]: string[] } = {
    "Artistic Styles": [
        "in the style of an oil painting",
        "make it cartoonish",
        "in the style of a detailed anime drawing",
        "as a watercolor painting",
        "in a pixel art style",
        "as a black and white sketch",
        "in a pop-art style like Andy Warhol",
        "in a vintage comic book style",
    ],
    "Lighting & Mood": [
        "with dramatic, cinematic lighting",
        "make it look moody",
        "add a cheerful atmosphere",
        "with soft, golden hour lighting",
        "with mysterious, foggy lighting",
        "with neon, cyberpunk lighting",
        "make it bright and sunny",
        "with a spooky, eerie glow",
    ],
    "Scene & Background": [
        "Extend the image",
        "change the background to a cyberpunk city",
        "place the subject on Mars",
        "make it nighttime",
        "add rain",
        "change the background to a lush jungle",
        "put them in an underwater scene",
        "change the background to a futuristic space station",
    ],
    "Character & Clothing": [
        "Change the clothes",
        "Add tattoos",
        "add a superhero cape",
        "change the clothes to a futuristic sci-fi suit",
        "give the person majestic wings",
        "change the clothes to elegant royal attire",
        "add a fantasy-style helmet",
        "make the person look like a cyborg",
    ],
};


interface BackgroundControlsProps {
  color: string;
  onColorChange: (color: string) => void;
  disabled: boolean;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({ color, onColorChange, disabled }) => {
  return (
    <div className={`bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <PaletteIcon className="w-5 h-5 text-[var(--text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Background Color
        </h3>
      </div>
      <div className="flex justify-center items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-16 h-10 p-1 bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-md cursor-pointer disabled:cursor-not-allowed"
          title="Select background color"
          disabled={disabled}
        />
        <span className="font-mono text-[var(--text-primary)]">{color.toUpperCase()}</span>
      </div>
    </div>
  );
};

const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

const generateFilename = (prompt: string, aspectRatio: string): string => {
  const promptPart = prompt
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

  const finalPromptPart = promptPart || 'ai-edit';
  const ratio = aspectRatio.replace(':', 'x');
  const timestamp = Date.now();

  return `${finalPromptPart}-${ratio}.jpg`;
};

interface ImageGeneratorProps {
    initialUpload: ImageFile | null;
    originalImage: ImageFile | null;
    generatedVariations: { [key: string]: string | undefined };
    redoState: { [key: string]: string | undefined } | null;
    prompt: string;
    isLoading: boolean;
    error: string | null;
    activeFilter: string;
    selectedAspectRatio: string;
    portraitQuality: 'hd' | 'fhd';
    backgroundColor: string;
    showPremiumModal: boolean;
    imageSize: number;
    goPremium: () => void;

    handleImageUpload: (file: File) => void;
    handleEdit: () => void;
    handleUndo: () => void;
    handleRedo: () => void;
    handleSetAsBase: (imageUrl: string) => void;
    handleDownloadVariation: (imageUrl: string, aspectRatio: string) => void;
    handleSaveVariationToFavorites: (imageUrl: string) => void;
    handleResetToInitial: () => void;
    handleSuggestionSelect: (suggestion: string) => void;
    setPrompt: (value: React.SetStateAction<string>) => void;
    setActiveFilter: (value: React.SetStateAction<string>) => void;
    setSelectedAspectRatio: (value: React.SetStateAction<string>) => void;
    setPortraitQuality: (value: React.SetStateAction<'hd' | 'fhd'>) => void;
    setBackgroundColor: (value: React.SetStateAction<string>) => void;
    setShowPremiumModal: (value: React.SetStateAction<boolean>) => void;
    setImageSize: (value: React.SetStateAction<number>) => void;
    resetStateForNewImage: () => void;
}


const ImageGenerator: React.FC<ImageGeneratorProps> = (props) => {
    const {
        originalImage,
        generatedVariations,
        redoState,
        prompt,
        isLoading,
        error,
        activeFilter,
        selectedAspectRatio,
        portraitQuality,
        backgroundColor,
        showPremiumModal,
        imageSize,
        goPremium,
        handleImageUpload,
        handleEdit,
        handleUndo,
        handleRedo,
        handleSetAsBase,
        handleDownloadVariation,
        handleSaveVariationToFavorites,
        handleResetToInitial,
        handleSuggestionSelect,
        setPrompt,
        setActiveFilter,
        setSelectedAspectRatio,
        setPortraitQuality,
        setBackgroundColor,
        setShowPremiumModal,
        setImageSize,
        resetStateForNewImage,
        initialUpload,
    } = props;
    
    const activeFilterCss = FILTERS.find(f => f.name === activeFilter)?.css || 'none';
    const hasVariations = Object.keys(generatedVariations).length > 0;
  
    return (
    <>
      {!originalImage && !isLoading && (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>
      )}
      
      {isLoading && !originalImage && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader />
          </div>
      )}

      {originalImage && (
        <>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8">
            <FilterControls
              filters={FILTERS}
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
            />
            <AspectRatioControls
              ratios={ASPECT_RATIOS}
              activeRatio={selectedAspectRatio}
              onSelectRatio={setSelectedAspectRatio}
            />
             <QualityControls 
              qualities={QUALITIES}
              activeQuality={portraitQuality}
              onSelectQuality={setPortraitQuality}
            />
            <BackgroundControls
              color={backgroundColor}
              onColorChange={setBackgroundColor}
              disabled={!hasVariations}
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <ImageDisplay label="Original" imageUrl={originalImage.previewUrl} filterCss={activeFilterCss} onReset={handleResetToInitial} isResettable={!!initialUpload && originalImage.previewUrl !== initialUpload.previewUrl} constrainHeight size={imageSize} onSizeChange={setImageSize} />
              
              <div className="w-full">
                <div className="flex justify-center items-center mb-4 relative">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">Generated Variations</h2>
                </div>
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-secondary)]/80 rounded-lg z-10">
                      <Loader />
                    </div>
                  )}
                  
                  {!hasVariations ? (
                     <div className="aspect-square w-full bg-[var(--background-secondary)] rounded-lg shadow-lg flex items-center justify-center overflow-hidden border border-[var(--border-primary)]">
                      <div className="text-[var(--text-secondary)] flex flex-col items-center">
                        <ImageIcon className="w-16 h-16" />
                        <p className="mt-2">Variations will appear here</p>
                      </div>
                    </div>
                  ) : (
                    <VariationsDisplay
                        variations={generatedVariations}
                        selectedAspectRatio={selectedAspectRatio}
                        onSelect={setSelectedAspectRatio}
                        onSetAsBase={handleSetAsBase}
                        onDownload={handleDownloadVariation}
                        onSaveToFavorites={handleSaveVariationToFavorites}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <EditControls
              prompt={prompt}
              onPromptChange={(e) => setPrompt(e.target.value)}
              onEdit={handleEdit}
              isLoading={isLoading}
              onClear={resetStateForNewImage}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={hasVariations}
              canRedo={!!redoState}
            />

            <PromptSuggestions 
                suggestions={PROMPT_SUGGESTIONS}
                onSelect={handleSuggestionSelect}
                disabled={isLoading}
            />
          </div>
        </>
      )}
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onConfirm={() => { goPremium(); setShowPremiumModal(false); }} />}
    </>
  );
};


const HomePage: React.FC = () => {
    const { theme } = useTheme();
    const [showLogin, setShowLogin] = useState(false);

    const openLogin = () => {
        setShowLogin(true);
    };

    const showcaseImages = [
        "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1528640/pexels-photo-1528640.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/235615/pexels-photo-235615.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/414102/pexels-photo-414102.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    return (
        <div className={`min-h-screen font-sans`}>
             <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3 group">
                        <SparklesIcon className="w-8 h-8 text-[var(--accent-primary)]" />
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">AI Photo Editor</h1>
                    </div>
                    <button
                        onClick={openLogin}
                        className="bg-[var(--accent-primary)] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            <main className="relative z-0">
                <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
                     <div className="relative z-10">
                        <PaintBrushIcon className="w-20 h-20 mx-auto mb-6 text-white" />
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent animated-gradient">Unleash Your Creativity with AI</h2>
                        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12">Transform your photos into stunning works of art. From simple touch-ups to fantastical transformations, our AI-powered editor makes it easy.</p>
                        <button
                            onClick={openLogin}
                            className="bg-[var(--accent-primary)] text-white font-bold py-3 px-8 text-base sm:text-lg rounded-full hover:bg-[var(--accent-primary-hover)] transition-transform hover:scale-105"
                        >
                            Start Editing for Free
                        </button>
                    </div>
                </section>
                
                <section className="container mx-auto px-4 py-8 sm:py-16">
                     <h3 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[var(--text-primary)]">See The Magic</h3>
                     <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {showcaseImages.map((src, index) => (
                             <img key={index} className="rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" src={src} alt={`Showcase image ${index + 1}`} loading="lazy" />
                        ))}
                    </div>
                </section>
            </main>

            {showLogin && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
                   <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
                    <Login onClose={() => setShowLogin(false)} />
                </div>
            )}
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { user, credits, isPremium, isProfilePublic, toggleProfilePublic, generationHistory, savedEdits, updateUsername, updateProfilePicture } = useUser();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    updateProfilePicture(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameSave = () => {
        if (newName.trim() && user && newName.trim() !== user.name) {
            updateUsername(newName.trim());
        }
        setIsEditingName(false);
    };
    
    if (!user) return null;

    const statCards = [
        {
            icon: ColorfulSaveIcon,
            label: "Favorites Saved",
            value: savedEdits.length,
            color: "cyan"
        },
        {
            icon: ColorfulHistoryIcon,
            label: "Total Generations",
            value: generationHistory.length,
            color: "pink"
        },
        ...(!isPremium ? [{
            icon: ColorfulSparklesIcon,
            label: "Credits Remaining",
            value: credits,
            color: "lime"
        }] : [])
    ];

    return (
        <div className="max-w-7xl mx-auto px-2">
            <div className="text-center mb-12">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePictureUpload}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                <div
                    className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change profile picture"
                >
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-[var(--border-primary)]" />
                    ) : (
                        <div className="w-full h-full rounded-full border-4 border-dashed border-[var(--border-primary)] grid place-items-center">
                            <UserIcon className="w-24 h-24 text-[var(--accent-primary)]" />
                        </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadIcon className="w-8 h-8 text-white" />
                    </div>
                </div>

                {!isEditingName ? (
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-4xl font-bold text-[var(--text-primary)]">{user.name}</h1>
                        <button 
                            onClick={() => { setIsEditingName(true); setNewName(user.name); }} 
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--background-tertiary)] transition-colors"
                            title="Edit name"
                        >
                            <EditIcon className="w-6 h-6" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 max-w-sm mx-auto"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNameSave();
                            if (e.key === 'Escape') setIsEditingName(false);
                        }}
                    >
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-grow bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-2 px-3 text-[var(--text-primary)] text-2xl font-bold text-center focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors"
                            autoFocus
                        />
                        <button onClick={handleNameSave} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Save</button>
                        <button onClick={() => setIsEditingName(false)} className="bg-[var(--danger-primary)] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[var(--danger-primary-hover)] transition-colors">Cancel</button>
                    </div>
                )}

                {isPremium ? (
                    <p className="text-yellow-400 font-semibold mt-2 text-lg">Premium Member</p>
                ) : (
                    <p className="text-[var(--text-secondary)] mt-2 text-lg">Free Member</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {statCards.map((card, index) => (
                    <div key={index} className={`bg-[var(--background-secondary)]/50 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:shadow-[0_0_25px] hover:-translate-y-1 border-cyan-500 shadow-cyan-500/20 hover:shadow-cyan-500/40`}>
                        <div className="flex items-center gap-6">
                            <card.icon className="w-12 h-12" />
                            <div>
                                <p className="text-lg text-[var(--text-secondary)]">{card.label}</p>
                                <p className="text-4xl font-bold text-[var(--text-primary)]">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="max-w-md mx-auto">
                <div className="bg-[var(--background-secondary)]/50 backdrop-blur-sm border-2 border-purple-500 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SettingsIcon className="w-6 h-6 text-purple-400" />
                            <label htmlFor="public-profile-toggle" className="text-lg font-medium text-[var(--text-primary)] cursor-pointer">
                                Public Gallery
                            </label>
                        </div>
                        <button
                            id="public-profile-toggle"
                            onClick={toggleProfilePublic}
                            role="switch"
                            aria-checked={isProfilePublic}
                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] ${
                                isProfilePublic ? 'bg-purple-500' : 'bg-[var(--border-secondary)]'
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    isProfilePublic ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                     <p className="text-sm text-[var(--text-secondary)]/80 mt-3 text-center">Toggle to make your favorites gallery visible to others (feature coming soon).</p>
                </div>
            </div>

            <Favorites />
        </div>
    );
};

type View = 'imageGenerator' | 'videoGenerator' | 'history' | 'dashboard' | 'settings';

const AppContent: React.FC = () => {
  const { user, isPremium, credits, deductCredits, goPremium, saveEdit, logGeneration } = useUser();
  const { theme, background } = useTheme();
  const [view, setView] = useState<View>('imageGenerator');
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const [initialUpload, setInitialUpload] = useState<ImageFile | null>(null);
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedVariations, setGeneratedVariations] = useState<{ [key: string]: string | undefined }>({});
  const [redoState, setRedoState] = useState<{ [key: string]: string | undefined } | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('None');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [portraitQuality, setPortraitQuality] = useState<'hd' | 'fhd'>('fhd');
  const [backgroundColor, setBackgroundColor] = useState<string>(theme === 'light' ? '#e2e8f0' : '#1f2937');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [imageSize, setImageSize] = useState<number>(100);

  useEffect(() => {
    setBackgroundColor(theme === 'light' ? '#e2e8f0' : '#1f2937');
  }, [theme]);
  
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

  const resetStateForNewImage = () => {
    setInitialUpload(null);
    setOriginalImage(null);
    setGeneratedVariations({});
    setRedoState(null);
    setError(null);
    setActiveFilter('None');
    setSelectedAspectRatio('1:1');
    setPortraitQuality('fhd');
    setBackgroundColor(theme === 'light' ? '#e2e8f0' : '#1f2937');
    setPrompt('');
    setImageSize(100);
  };

  const handleImageUpload = async (file: File) => {
    resetStateForNewImage();
    const imageFile = {
      file: file,
      previewUrl: URL.createObjectURL(file),
    };
    setInitialUpload(imageFile);
    setOriginalImage(imageFile);
  };

  const handleEdit = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter an editing prompt.');
      return;
    }

    if (!isPremium && credits < 20) {
      setError(`You need 20 credits for an edit. You have ${credits}.`);
      setShowPremiumModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedVariations({});

    try {
      if (!deductCredits(20)) {
         throw new Error("An unknown error occurred with credits.");
      }
      
      const basePrompt = prompt.trim();
      const ratios = ['1:1', '16:9', '9:16'];
      
      const promises = ratios.map(ratio => {
        let modifiedPrompt: string;

        switch (ratio) {
            case '16:9':
                modifiedPrompt = `Apply this edit: "${basePrompt}". Re-render the entire scene within a wider, landscape 16:9 aspect ratio. The new image should show more of the environment to the left and right of the original subject. Imagine you are zooming out the camera to capture a wider view. The original content should be naturally integrated into this larger, seamless scene. Do not simply add bars or borders; generate new, consistent image data to fill the expanded space.`;
                break;
            case '9:16':
                const qualityPrompt = portraitQuality === 'fhd' 
                    ? 'as a Full HD (1080x1920) phone wallpaper' 
                    : 'as an HD (720x1280) phone wallpaper';
                modifiedPrompt = `Apply this edit: "${basePrompt}". Re-render the entire scene within a taller, portrait 9:16 aspect ratio, suitable for ${qualityPrompt}. The new image should show more of the environment above and below the original subject. Imagine you are tilting the camera up and down or zooming out to capture a taller view. The original content should be naturally integrated into this larger, seamless scene. Do not simply add bars or borders; generate new, consistent image data to fill the expanded space.`;
                break;
            case '1:1':
            default:
                modifiedPrompt = `Apply this edit: "${basePrompt}". Generate the result as a well-composed square image with a 1:1 aspect ratio.`;
                break;
        }
        return editImageWithGemini(originalImage.file, modifiedPrompt);
      });

      const results = await Promise.all(promises);

      const newVariations = {
        '1:1': `data:image/jpeg;base64,${results[0]}`,
        '16:9': `data:image/jpeg;base64,${results[1]}`,
        '9:16': `data:image/jpeg;base64,${results[2]}`,
      };
      
      if(originalImage) {
        for(const ratio of ratios) {
            const editedUrl = newVariations[ratio];
            if(editedUrl) {
                logGeneration({
                    original: originalImage.previewUrl,
                    edited: editedUrl,
                    prompt: basePrompt,
                });
            }
        }
      }

      setGeneratedVariations(newVariations);
      setSelectedAspectRatio('1:1');
      setRedoState(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt, isPremium, credits, deductCredits, portraitQuality, logGeneration]);

  const handleUndo = () => {
    if (Object.keys(generatedVariations).length === 0) return;
    setRedoState(generatedVariations);
    setGeneratedVariations({});
  };

  const handleRedo = () => {
    if (!redoState) return;
    setGeneratedVariations(redoState);
    setRedoState(null);
  };

  const handleSetAsBase = async (imageUrl: string) => {
    const newFile = await dataUrlToFile(imageUrl, originalImage?.file.name || 'edited-image.jpg');
    const newImageFile = {
        file: newFile,
        previewUrl: imageUrl
    };
    setOriginalImage(newImageFile);
    setGeneratedVariations({});
    setRedoState(null);
    setPrompt('');
    setError(null);
  };
  
  const downloadCroppedImage = (imageUrl: string, targetAspectRatio: string, filename: string) => {
    if (targetAspectRatio === '1:1') {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const originalWidth = img.width;
        const originalHeight = img.height;

        const [arW, arH] = targetAspectRatio.split(':').map(Number);
        const targetRatio = arW / arH;

        let sWidth, sHeight, sx, sy;
        
        if (targetRatio > 1) { // Landscape
            sWidth = originalWidth;
            sHeight = originalWidth / targetRatio;
            sx = 0;
            sy = (originalHeight - sHeight) / 2;
        } else { // Portrait
            sHeight = originalHeight;
            sWidth = originalHeight * targetRatio;
            sy = 0;
            sx = (originalWidth - sWidth) / 2;
        }

        canvas.width = sWidth;
        canvas.height = sHeight;

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

        const link = document.createElement('a');
        link.href = croppedDataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    img.onerror = (err) => {
        console.error("Failed to load image for cropping, falling back to direct download.", err);
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
  };

  const handleDownloadVariation = (imageUrl: string, aspectRatio: string) => {
    const filename = generateFilename(prompt, aspectRatio);
    downloadCroppedImage(imageUrl, aspectRatio, filename);
  };

  const handleSaveVariationToFavorites = (imageUrl: string) => {
    if (originalImage) {
        saveEdit({
            original: originalImage.previewUrl,
            edited: imageUrl,
            prompt: prompt || "Variation",
        });
        alert("Image saved to your Favorites!");
    }
  };
  
  const handleResetToInitial = async () => {
    if (initialUpload) {
        setOriginalImage(initialUpload);
        setGeneratedVariations({});
        setRedoState(null);
        setPrompt('');
        setError(null);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setPrompt(prev => {
        const trimmedPrev = prev.trim();
        if (!trimmedPrev) return suggestion;
        if (trimmedPrev.endsWith(',') || trimmedPrev.endsWith('.')) return `${trimmedPrev} ${suggestion}`;
        return `${trimmedPrev}, ${suggestion}`;
    });
  };

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
        <HomePage />
    </div>;
  }
  
  const imageGeneratorProps = {
    initialUpload,
    originalImage,
    generatedVariations,
    redoState,
    prompt,
    isLoading,
    error,
    activeFilter,
    selectedAspectRatio,
    portraitQuality,
    backgroundColor,
    showPremiumModal,
    imageSize,
    goPremium,
    handleImageUpload,
    handleEdit,
    handleUndo,
    handleRedo,
    handleSetAsBase,
    handleDownloadVariation,
    handleSaveVariationToFavorites,
    handleResetToInitial,
    handleSuggestionSelect,
    setPrompt,
    setActiveFilter,
    setSelectedAspectRatio,
    setPortraitQuality,
    setBackgroundColor,
    setShowPremiumModal,
    setImageSize,
    resetStateForNewImage
  };

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
            {view === 'imageGenerator' && <ImageGenerator {...imageGeneratorProps} />}
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
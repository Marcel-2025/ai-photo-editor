import React, { useState, useCallback, useEffect } from 'react';
import { ImageFile } from './types';
import { editImageWithGemini } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { EditControls } from './components/EditControls';
import { Loader } from './components/Loader';
import { FilterControls, Filter } from './components/FilterControls';
import { AspectRatioControls, AspectRatio } from './components/AspectRatioControls';
import { PaletteIcon } from './components/IconComponents';
import { PromptSuggestions } from './components/PromptSuggestions';

import { UserProvider, useUser } from './contexts/UserContext';
import { Login } from './components/Login';
import { Favorites } from './components/Gallery';
import { PremiumModal } from './components/PremiumModal';
import { VariationsDisplay } from './components/VariationsDisplay';
import { QualityControls, PortraitQuality } from './components/QualityControls';
import { History } from './components/History';

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
        "as a stained glass window",
        "in a claymation style",
        "as a detailed charcoal drawing",
        "in a futuristic, cyberpunk art style",
        "as a children's book illustration",
        "in the style of ancient Egyptian hieroglyphs",
        "as a vibrant graffiti mural",
        "in a minimalist line art style",
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
        "with volumetric light rays",
        "backlit with a strong rim light",
        "with warm, cozy candlelight",
        "with dramatic film noir shadows",
        "with a magical, sparkling aura",
        "with an apocalyptic, red-sky glow",
        "with dreamy, pastel-colored light",
        "with a single, focused spotlight",
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
        "change the background to a field of giant flowers",
        "place them inside a crystal cave",
        "change the background to a post-apocalyptic wasteland",
        "put them in a whimsical, floating candy land",
        "change the background to a grand, baroque library",
        "place them on the rings of Saturn",
        "put them in a serene, Japanese zen garden",
        "change the background to an active volcano",
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
        "change the clothes to post-apocalyptic scavenger gear",
        "add intricate, glowing magical runes on their skin",
        "change the clothes to a sleek spy tuxedo",
        "make the person's hair out of flowing fire",
        "add elegant Venetian carnival mask",
        "change clothes to be made of plants and leaves",
        "give them shimmering, galaxy-patterned skin",
        "add a cute animal sidekick on their shoulder",
    ],
};


interface BackgroundControlsProps {
  color: string;
  onColorChange: (color: string) => void;
  disabled: boolean;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({ color, onColorChange, disabled }) => {
  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <PaletteIcon className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Background Color
        </h3>
      </div>
      <div className="flex justify-center items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-16 h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer disabled:cursor-not-allowed"
          title="Select background color"
          disabled={disabled}
        />
        <span className="font-mono text-gray-300">{color.toUpperCase()}</span>
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
  // Take the first 5 words of the prompt, or use a default.
  const promptPart = prompt
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ''); // Remove anything that's not a letter, number, or hyphen.

  const finalPromptPart = promptPart || 'ai-edit';
  const ratio = aspectRatio.replace(':', 'x');
  const timestamp = Date.now();

  return `${finalPromptPart}-${ratio}-${timestamp}.jpg`;
};

interface PhotoEditorProps {
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
    resetStateForNewImage: () => void;
}


const PhotoEditor: React.FC<PhotoEditorProps> = (props) => {
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
        resetStateForNewImage,
        initialUpload,
    } = props;
    
    const activeFilterCss = FILTERS.find(f => f.name === activeFilter)?.css || 'none';
    const selectedVariationUrl = generatedVariations[selectedAspectRatio] || null;
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageDisplay label="Original" imageUrl={originalImage.previewUrl} filterCss={activeFilterCss} onReset={handleResetToInitial} isResettable={!!initialUpload && originalImage.previewUrl !== initialUpload.previewUrl} />
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg z-10">
                  <Loader />
                </div>
              )}
              <ImageDisplay 
                label={`${selectedAspectRatio} Variation`}
                imageUrl={selectedVariationUrl} 
                filterCss={activeFilterCss} 
                backgroundColor={selectedVariationUrl ? backgroundColor : undefined}
                aspectRatio={selectedAspectRatio}
              />
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

          {hasVariations && (
              <VariationsDisplay
                  variations={generatedVariations}
                  selectedAspectRatio={selectedAspectRatio}
                  onSelect={setSelectedAspectRatio}
                  onSetAsBase={handleSetAsBase}
                  onDownload={handleDownloadVariation}
                  onSaveToFavorites={handleSaveVariationToFavorites}
              />
          )}
          
          <Favorites />
        </>
      )}
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onConfirm={() => { goPremium(); setShowPremiumModal(false); }} />}
    </>
  );
};

const AppContent: React.FC = () => {
  const { user, isPremium, credits, deductCredits, goPremium, saveEdit, logGeneration } = useUser();
  const [view, setView] = useState<'editor' | 'history'>('editor');

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
  const [backgroundColor, setBackgroundColor] = useState<string>('#1f2937');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const resetStateForNewImage = () => {
    setInitialUpload(null);
    setOriginalImage(null);
    setGeneratedVariations({});
    setRedoState(null);
    setError(null);
    setActiveFilter('None');
    setSelectedAspectRatio('1:1');
    setPortraitQuality('fhd');
    setBackgroundColor('#1f2937');
    setPrompt('');
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

  if (!user) {
    return <Login />;
  }
  
  const photoEditorProps = {
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
    resetStateForNewImage
  };

  return (
     <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onNavigate={setView} currentView={view} />
      <main className="container mx-auto px-4 py-8">
        {view === 'editor' && <PhotoEditor {...photoEditorProps} />}
        {view === 'history' && <History />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
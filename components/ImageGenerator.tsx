import React, { useState, useCallback, useEffect } from 'react';
import { ImageFile } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { ImageUploader } from './ImageUploader';
import { ImageDisplay } from './ImageDisplay';
import { EditControls } from './EditControls';
import { Loader } from './Loader';
import { FilterControls, Filter } from './FilterControls';
import { AspectRatioControls, AspectRatio } from './AspectRatioControls';
import { PaletteIcon, ImageIcon } from './IconComponents';
import { PromptSuggestions } from './PromptSuggestions';
import { useUser } from '../contexts/UserContext';
import { PremiumModal } from './PremiumModal';
import { VariationsDisplay } from './VariationsDisplay';
import { QualityControls, PortraitQuality } from './QualityControls';
import { useTheme } from '../contexts/ThemeContext';

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

export const ImageGenerator: React.FC = () => {
    const { isPremium, credits, deductCredits, goPremium, saveEdit, logGeneration } = useUser();
    const { theme } = useTheme();

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

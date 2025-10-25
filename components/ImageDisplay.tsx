import React from 'react';
import { ImageIcon, RedoIcon } from './IconComponents';

interface ImageDisplayProps {
  label: string;
  imageUrl: string | null;
  filterCss?: string;
  backgroundColor?: string;
  onReset?: () => void;
  isResettable?: boolean;
  aspectRatio?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ label, imageUrl, filterCss, backgroundColor, onReset, isResettable, aspectRatio }) => {
  const getAspectRatioClass = (ratio?: string) => {
    // This function is used for generated variations with a forced aspect ratio,
    // or for the placeholder.
    switch (ratio) {
        case '16:9': return 'aspect-[16/9]';
        case '9:16': return 'aspect-[9/16]';
        default: return 'aspect-square';
    }
  }
    
  return (
    <div className="w-full">
      <div className="flex justify-center items-center mb-4 relative">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{label}</h2>
        {isResettable && onReset && (
             <button onClick={onReset} title="Reset to Original" className="absolute right-0 text-sm flex items-center gap-1 bg-[var(--background-tertiary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] px-2 py-1 rounded-md transition-colors">
                <RedoIcon className="w-4 h-4 transform -scale-x-100" />
                Reset
             </button>
        )}
      </div>
      <div 
        // Apply aspect ratio class only if it's explicitly provided OR if there's no image URL yet.
        // This makes the placeholder square but lets the original image set its own aspect ratio.
        className={`${(aspectRatio || !imageUrl) ? getAspectRatioClass(aspectRatio) : ''} w-full bg-[var(--background-secondary)] rounded-lg shadow-lg flex items-center justify-center overflow-hidden border border-[var(--border-primary)] transition-colors duration-300`}
        style={{ backgroundColor }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={label} 
            // If an aspect ratio is forced, cover the container. Otherwise, display the full image.
            className={`transition-all duration-300 ${aspectRatio ? 'w-full h-full object-cover' : 'w-full h-auto'}`}
            style={{ filter: filterCss }}
          />
        ) : (
          <div className="text-[var(--text-secondary)] flex flex-col items-center">
            <ImageIcon className="w-16 h-16" />
            <p className="mt-2">{label} image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
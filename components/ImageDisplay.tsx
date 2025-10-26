import React from 'react';
import { ImageIcon, RedoIcon, PlusIcon, MinusIcon } from './IconComponents';

interface ImageDisplayProps {
  label: string;
  imageUrl: string | null;
  filterCss?: string;
  backgroundColor?: string;
  onReset?: () => void;
  isResettable?: boolean;
  aspectRatio?: string;
  constrainHeight?: boolean;
  size?: number;
  onSizeChange?: (newSize: number) => void;
}

const SizeControls: React.FC<{ size: number, onSizeChange: (newSize: number) => void }> = ({ size, onSizeChange }) => {
    const handleDecrement = () => {
        onSizeChange(Math.max(20, size - 10)); // Min size 20%
    }
    const handleIncrement = () => {
        onSizeChange(Math.min(100, size + 10)); // Max size 100%
    }

    return (
        <div className="absolute left-0 flex items-center gap-2">
            <button 
                onClick={handleDecrement}
                disabled={size <= 20}
                className="p-1 rounded-md bg-[var(--background-tertiary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Decrease size"
            >
                <MinusIcon className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono text-[var(--text-secondary)] w-10 text-center">{size}%</span>
             <button 
                onClick={handleIncrement}
                disabled={size >= 100}
                className="p-1 rounded-md bg-[var(--background-tertiary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Increase size"
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    )
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ label, imageUrl, filterCss, backgroundColor, onReset, isResettable, aspectRatio, constrainHeight, size, onSizeChange }) => {
  const getAspectRatioClass = (ratio?: string) => {
    switch (ratio) {
        case '16:9': return 'aspect-[16/9]';
        case '9:16': return 'aspect-[9/16]';
        default: return 'aspect-square';
    }
  }
    
  return (
    <div className="w-full transition-all duration-300" style={size ? { width: `${size}%`, margin: '0 auto' } : {}}>
      <div className="flex justify-center items-center mb-4 relative">
        {onSizeChange && typeof size !== 'undefined' && <SizeControls size={size} onSizeChange={onSizeChange} />}
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{label}</h2>
        {isResettable && onReset && (
             <button onClick={onReset} title="Reset to Original" className="absolute right-0 text-sm flex items-center gap-1 bg-[var(--background-tertiary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] px-2 py-1 rounded-md transition-colors">
                <RedoIcon className="w-4 h-4 transform -scale-x-100" />
                Reset
             </button>
        )}
      </div>
      <div 
        className={`${(aspectRatio || !imageUrl) ? getAspectRatioClass(aspectRatio) : ''} w-full bg-[var(--background-secondary)] rounded-lg shadow-lg flex items-center justify-center overflow-hidden border border-[var(--border-primary)] transition-colors duration-300 ${constrainHeight ? 'max-h-[70vh]' : ''}`}
        style={{ backgroundColor }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={label} 
            className={`transition-all duration-300 ${aspectRatio ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'}`}
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

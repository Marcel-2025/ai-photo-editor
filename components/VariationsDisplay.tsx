import React from 'react';
import { CopyIcon, DownloadIcon, SaveIcon, ImageIcon, SquareIcon } from './IconComponents';

interface VariationsDisplayProps {
    variations: { [key: string]: string | undefined };
    selectedAspectRatio: string;
    onSelect: (ratio: string) => void;
    onSetAsBase: (imageUrl: string) => void;
    onDownload: (imageUrl: string, aspectRatio: string) => void;
    onSaveToFavorites: (imageUrl: string) => void;
}

const RATIO_CONFIG = [
    { value: '1:1', name: 'Square', aspectClass: 'aspect-square' },
    { value: '16:9', name: 'Landscape', aspectClass: 'aspect-video' },
    { value: '9:16', name: 'Portrait', aspectClass: 'aspect-[9/16]' },
];

export const VariationsDisplay: React.FC<VariationsDisplayProps> = ({ variations, selectedAspectRatio, onSelect, onSetAsBase, onDownload, onSaveToFavorites }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">Generated Variations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RATIO_CONFIG.map((ratio) => {
            const imageUrl = variations[ratio.value];
            const isSelected = selectedAspectRatio === ratio.value;

            return (
                <div key={ratio.value}>
                    <h3 className="text-center font-semibold text-[var(--text-primary)] mb-2">{ratio.name} ({ratio.value})</h3>
                    <div 
                        onClick={() => imageUrl && onSelect(ratio.value)}
                        className={`
                            ${ratio.aspectClass} 
                            bg-[var(--background-secondary)] rounded-lg overflow-hidden shadow-lg group relative border-2 
                            ${isSelected ? 'border-[var(--accent-primary)]' : 'border-[var(--border-primary)]'}
                            ${imageUrl ? 'cursor-pointer' : 'cursor-default'}
                            transition-all duration-200
                        `}
                    >
                        {imageUrl ? (
                            <>
                                <img src={imageUrl} alt={`${ratio.name} Variation`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onSetAsBase(imageUrl); }}
                                        title="Use as Base"
                                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                        <CopyIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSaveToFavorites(imageUrl); }} 
                                        title="Save to Favorites"
                                        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                                        <SaveIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDownload(imageUrl, ratio.value); }} 
                                        title={`Download ${ratio.name} (Cropped)`}
                                        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                                        <DownloadIcon className="w-5 h-5" />
                                    </button>
                                     {ratio.value !== '1:1' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDownload(imageUrl, '1:1'); }} 
                                            title="Download Full Square"
                                            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">
                                            <SquareIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
                                <ImageIcon className="w-10 h-10 mb-2" />
                                <span className="text-sm">Not generated</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CopyIcon, DownloadIcon, SaveIcon, ImageIcon, SquareIcon } from './IconComponents';

interface VariationsDisplayProps {
    variations: { [key: string]: string | undefined };
    selectedAspectRatio: string;
    onSelect: (ratio: string) => void;
    onSetAsBase: (imageUrl: string) => void;
    onDownload: (imageUrl: string, aspectRatio: string) => void;
    onSaveToFavorites: (imageUrl: string) => void;
}

export const VariationsDisplay: React.FC<VariationsDisplayProps> = ({ variations, selectedAspectRatio, onSelect, onSetAsBase, onDownload, onSaveToFavorites }) => {
  const { t } = useTranslation();
  
  const RATIO_CONFIG = [
    { value: '1:1', name: t('imageGenerator.ratios.square'), aspectClass: 'aspect-square' },
    { value: '16:9', name: t('imageGenerator.ratios.landscape'), aspectClass: 'aspect-video' },
    { value: '9:16', name: t('imageGenerator.ratios.portrait'), aspectClass: 'aspect-[9/16]' },
  ];
  
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
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
                                        title={t('imageGenerator.variations.useAsBase')}
                                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                        <CopyIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSaveToFavorites(imageUrl); }} 
                                        title={t('imageGenerator.variations.saveToFavorites')}
                                        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                                        <SaveIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDownload(imageUrl, ratio.value); }} 
                                        title={t('imageGenerator.variations.downloadCropped', { name: ratio.name })}
                                        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                                        <DownloadIcon className="w-5 h-5" />
                                    </button>
                                     {ratio.value !== '1:1' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDownload(imageUrl, '1:1'); }} 
                                            title={t('imageGenerator.variations.downloadFullSquare')}
                                            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">
                                            <SquareIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
                                <ImageIcon className="w-10 h-10 mb-2" />
                                <span className="text-sm">{t('imageGenerator.variations.notGenerated')}</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        })}
    </div>
  );
};

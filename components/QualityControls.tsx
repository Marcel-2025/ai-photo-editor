import React from 'react';
import { ScreenResolutionIcon } from './IconComponents';

export interface PortraitQuality {
  name: string;
  value: 'hd' | 'fhd';
}

interface QualityControlsProps {
  qualities: PortraitQuality[];
  activeQuality: 'hd' | 'fhd';
  onSelectQuality: (qualityValue: 'hd' | 'fhd') => void;
}

export const QualityControls: React.FC<QualityControlsProps> = ({
  qualities,
  activeQuality,
  onSelectQuality,
}) => {
  return (
    <div className="bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <ScreenResolutionIcon className="w-5 h-5 text-[var(--text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Portrait Quality
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {qualities.map((quality) => (
          <button
            key={quality.name}
            onClick={() => onSelectQuality(quality.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeQuality === quality.value
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'bg-[var(--background-secondary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)]'
            }`}
          >
            {quality.name}
          </button>
        ))}
      </div>
    </div>
  );
};
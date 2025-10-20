import React from 'react';
import { AspectRatioIcon } from './IconComponents';

export interface AspectRatio {
  name: string;
  value: string;
}

interface AspectRatioControlsProps {
  ratios: AspectRatio[];
  activeRatio: string;
  onSelectRatio: (ratioValue: string) => void;
}

export const AspectRatioControls: React.FC<AspectRatioControlsProps> = ({
  ratios,
  activeRatio,
  onSelectRatio,
}) => {
  return (
    <div className="bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <AspectRatioIcon className="w-5 h-5 text-[var(--text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Aspect Ratio
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {ratios.map((ratio) => (
          <button
            key={ratio.name}
            onClick={() => onSelectRatio(ratio.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeRatio === ratio.value
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'bg-[var(--background-secondary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)]'
            }`}
          >
            {ratio.name}
          </button>
        ))}
      </div>
    </div>
  );
};
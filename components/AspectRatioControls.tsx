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
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <AspectRatioIcon className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
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
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            {ratio.name}
          </button>
        ))}
      </div>
    </div>
  );
};
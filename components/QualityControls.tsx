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
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <ScreenResolutionIcon className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
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
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            {quality.name}
          </button>
        ))}
      </div>
    </div>
  );
};
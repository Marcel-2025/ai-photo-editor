
import React from 'react';
import { ImageIcon } from './IconComponents';

interface ImageDisplayProps {
  label: string;
  imageUrl: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ label, imageUrl }) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-center mb-4 text-gray-300">{label}</h2>
      <div className="aspect-square w-full bg-gray-800 rounded-lg shadow-lg flex items-center justify-center overflow-hidden border border-gray-700">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-500 flex flex-col items-center">
            <ImageIcon className="w-16 h-16" />
            <p className="mt-2">{label} image will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ImageIcon, HistoryIcon, CloseIcon } from './IconComponents';
import { SavedEdit } from '../types';

export const History: React.FC = () => {
  const { generationHistory } = useUser();
  const [selectedImage, setSelectedImage] = useState<SavedEdit | null>(null);

  // Show newest edits first
  const reversedHistory = [...generationHistory].reverse();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <HistoryIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white text-center">
            My Generation History
          </h1>
        </div>

        {reversedHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {reversedHistory.map((edit) => (
              <div
                key={edit.id}
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative group cursor-pointer shadow-lg transition-transform hover:scale-105"
                onClick={() => setSelectedImage(edit)}
              >
                <img
                  src={edit.edited}
                  alt={edit.prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-xs line-clamp-3">
                    {edit.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl">
            <ImageIcon className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold">No History Found</h2>
            <p className="mt-2">
              Your saved generations will appear here once you create them.
            </p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
              <p className="text-gray-300">
                <span className="font-semibold text-gray-200">Prompt:</span>{' '}
                {selectedImage.prompt}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(selectedImage.id)}
              </p>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <img
                src={selectedImage.edited}
                alt={selectedImage.prompt}
                className="w-full h-auto max-h-full object-contain mx-auto rounded-md"
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              title="Close"
              className="absolute top-3 right-3 bg-gray-700 text-gray-300 rounded-full p-2 hover:bg-gray-600 hover:text-white transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
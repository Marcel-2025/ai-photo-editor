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
          <HistoryIcon className="w-8 h-8 text-[var(--accent-primary)]" />
          <h1 className="text-3xl font-bold text-[var(--text-primary)] text-center">
            My Generation History
          </h1>
        </div>

        {reversedHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {reversedHistory.map((edit) => (
              <div
                key={edit.id}
                className="aspect-square bg-[var(--background-secondary)] rounded-lg overflow-hidden relative group cursor-pointer shadow-lg transition-transform hover:scale-105 border border-[var(--border-primary)]"
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
          <div className="text-center py-20 text-[var(--text-secondary)] bg-[var(--background-tertiary)] border-2 border-dashed border-[var(--border-secondary)] rounded-xl">
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
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[var(--border-primary)] flex-shrink-0">
              <p className="text-[var(--text-primary)]">
                <span className="font-semibold text-[var(--text-primary)]">Prompt:</span>{' '}
                {selectedImage.prompt}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {formatDate(selectedImage.id)}
              </p>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center overflow-hidden min-h-0">
              <img
                src={selectedImage.edited}
                alt={selectedImage.prompt}
                className="max-w-full max-h-full object-contain rounded-md"
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              title="Close"
              className="absolute top-3 right-3 bg-[var(--background-tertiary)] text-[var(--text-secondary)] rounded-full p-2 hover:bg-[var(--border-primary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
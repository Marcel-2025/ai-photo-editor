import React from 'react';
import { useUser } from '../contexts/UserContext';
import { ImageIcon } from './IconComponents';

export const Favorites: React.FC = () => {
  const { savedEdits } = useUser();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">My Favorites</h2>
      {savedEdits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedEdits.map((edit) => (
            <div key={edit.id} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden shadow-lg group">
              <img src={edit.edited} alt={edit.prompt} className="w-full h-48 object-cover" />
              <div className="p-3">
                <p className="text-sm text-gray-300 truncate" title={edit.prompt}>
                  <span className="font-semibold">Prompt:</span> {edit.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl">
          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
          <p>Your favorite edits will appear here.</p>
        </div>
      )}
    </div>
  );
};
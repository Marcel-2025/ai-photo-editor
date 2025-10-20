import React from 'react';
import { MagicWandIcon, TrashIcon, UndoIcon, RedoIcon } from './IconComponents';

interface EditControlsProps {
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  isLoading: boolean;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const EditControls: React.FC<EditControlsProps> = ({
  prompt,
  onPromptChange,
  onEdit,
  isLoading,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-2xl mt-8">
      <div className="relative flex-grow w-full">
        <MagicWandIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={prompt}
          onChange={onPromptChange}
          placeholder="e.g., 'Add a superhero cape to the person'"
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
        <button
          onClick={onEdit}
          disabled={isLoading || !prompt.trim()}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate (20 Cr)'}
        </button>

        <button
          onClick={onUndo}
          title="Undo Variation"
          className="p-3 ml-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-600/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || !canUndo}
        >
          <UndoIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onRedo}
          title="Redo Variation"
          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-600/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || !canRedo}
        >
          <RedoIcon className="w-6 h-6" />
        </button>
        
         <button
          onClick={onClear}
          title="Start Over with New Image"
          className="p-3 bg-red-600/80 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-600 transition-colors"
          disabled={isLoading}
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { LightbulbIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';

interface PromptSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled: boolean;
}

const SUGGESTIONS_PER_PAGE = 8;

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect, disabled }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(suggestions.length / SUGGESTIONS_PER_PAGE);
  const startIndex = currentPage * SUGGESTIONS_PER_PAGE;
  const endIndex = startIndex + SUGGESTIONS_PER_PAGE;
  const currentSuggestions = suggestions.slice(startIndex, endIndex);

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className={`mt-6 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <LightbulbIcon className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-gray-300">Prompt Ideas</h3>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={disabled || currentPage === 0}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          title="Previous suggestions"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currentSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSelect(suggestion)}
              disabled={disabled}
              className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:hover:bg-gray-700 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={disabled || currentPage >= totalPages - 1}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          title="Next suggestions"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mt-3">
        <span className="text-sm text-gray-400 font-mono">
          Page {currentPage + 1} / {totalPages}
        </span>
      </div>
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { LightbulbIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';

interface PromptSuggestionsProps {
  suggestions: { [category: string]: string[] };
  onSelect: (suggestion: string) => void;
  disabled: boolean;
}

const PROMPTS_PER_PAGE = 8;

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect, disabled }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const maxPromptsInCategory = useMemo(() => {
    return Math.max(...Object.values(suggestions).map(arr => arr.length));
  }, [suggestions]);

  const totalPages = Math.ceil(maxPromptsInCategory / PROMPTS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * PROMPTS_PER_PAGE;
  const endIndex = startIndex + PROMPTS_PER_PAGE;

  return (
    <div className={`mt-8 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <LightbulbIcon className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-gray-300">Prompt Ideas</h3>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={disabled || totalPages <= 1}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-600/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="space-y-6">
            {Object.entries(suggestions).map(([category, prompts]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">{category}</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {prompts.slice(startIndex, endIndex).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => onSelect(suggestion)}
                      disabled={disabled}
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:hover:bg-gray-700 disabled:cursor-not-allowed"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextPage}
          disabled={disabled || totalPages <= 1}
          className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:bg-gray-600/50 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
      
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-400">
          Page {currentPage + 1} of {totalPages}
        </div>
      )}
    </div>
  );
};
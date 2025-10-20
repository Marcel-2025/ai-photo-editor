import React, { useState, useMemo } from 'react';
import { LightbulbIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';
import { useTheme } from '../contexts/ThemeContext';

interface PromptSuggestionsProps {
  suggestions: { [category: string]: string[] };
  onSelect: (suggestion: string) => void;
  disabled: boolean;
}

const PROMPTS_PER_PAGE = 8;

const neonColors = [
    { border: 'border-cyan-400', text: 'text-cyan-300', shadow: 'shadow-[0_0_8px_theme(colors.cyan.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.cyan.500)]' },
    { border: 'border-pink-400', text: 'text-pink-300', shadow: 'shadow-[0_0_8px_theme(colors.pink.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.pink.500)]' },
    { border: 'border-lime-400', text: 'text-lime-300', shadow: 'shadow-[0_0_8px_theme(colors.lime.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.lime.500)]' },
    { border: 'border-purple-400', text: 'text-purple-300', shadow: 'shadow-[0_0_8px_theme(colors.purple.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.purple.500)]' },
    { border: 'border-yellow-400', text: 'text-yellow-300', shadow: 'shadow-[0_0_8px_theme(colors.yellow.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.yellow.500)]' },
    { border: 'border-red-400', text: 'text-red-300', shadow: 'shadow-[0_0_8px_theme(colors.red.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.red.500)]' },
    { border: 'border-green-400', text: 'text-green-300', shadow: 'shadow-[0_0_8px_theme(colors.green.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.green.500)]' },
    { border: 'border-indigo-400', text: 'text-indigo-300', shadow: 'shadow-[0_0_8px_theme(colors.indigo.500)]', hoverShadow: 'hover:shadow-[0_0_18px_theme(colors.indigo.500)]' },
];


export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect, disabled }) => {
  const { promptStyle } = useTheme();
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
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Prompt Ideas</h3>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={disabled || totalPages <= 1}
          className="p-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--border-primary)] disabled:bg-[var(--background-secondary)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="space-y-6">
            {Object.entries(suggestions).map(([category, prompts]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 text-center">{category}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {prompts.slice(startIndex, endIndex).map((suggestion, index) => {
                    const color = neonColors[index % neonColors.length];
                    const isNeon = promptStyle === 'neon';
                    return (
                        <button
                          key={index}
                          onClick={() => onSelect(suggestion)}
                          disabled={disabled}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-300 transform disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60
                            ${isNeon
                                ? `bg-[var(--background-primary)]/50 ${color.border} ${color.text} ${color.shadow} ${color.hoverShadow} hover:scale-105`
                                : `bg-[var(--background-secondary)] border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)] hover:text-[var(--text-primary)]`
                            }`
                          }
                        >
                          {suggestion}
                        </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextPage}
          disabled={disabled || totalPages <= 1}
          className="p-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--border-primary)] disabled:bg-[var(--background-secondary)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
      
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-[var(--text-secondary)]">
          Page {currentPage + 1} of {totalPages}
        </div>
      )}
    </div>
  );
};
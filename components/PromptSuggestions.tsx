import React, { useState, useMemo, useEffect } from 'react';
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
  const [currentPages, setCurrentPages] = useState<{ [category: string]: number }>({});

  useEffect(() => {
    const initialPages = Object.keys(suggestions).reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as { [category: string]: number });
    setCurrentPages(initialPages);
  }, [suggestions]);

  const pagesInfo = useMemo(() => {
    return Object.entries(suggestions).reduce((acc, [category, prompts]) => {
      acc[category] = {
        // FIX: Cast `prompts` to `string[]` because it is inferred as `unknown`.
        totalPages: Math.ceil((prompts as string[]).length / PROMPTS_PER_PAGE)
      };
      return acc;
    }, {} as { [category: string]: { totalPages: number } });
  }, [suggestions]);


  const handleNextPage = (category: string) => {
    const totalPages = pagesInfo[category]?.totalPages || 1;
    setCurrentPages((prev) => ({
      ...prev,
      [category]: ((prev[category] ?? 0) + 1) % totalPages,
    }));
  };

  const handlePrevPage = (category: string) => {
    const totalPages = pagesInfo[category]?.totalPages || 1;
    setCurrentPages((prev) => ({
      ...prev,
      [category]: ((prev[category] ?? 0) - 1 + totalPages) % totalPages,
    }));
  };

  return (
    <div className={`mt-8 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-6">
        <LightbulbIcon className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Prompt Ideas</h3>
      </div>
      
      <div className="space-y-8">
        {Object.entries(suggestions).map(([category, prompts]) => {
          const currentPage = currentPages[category] ?? 0;
          const totalPages = pagesInfo[category]?.totalPages || 1;
          const startIndex = currentPage * PROMPTS_PER_PAGE;
          const endIndex = startIndex + PROMPTS_PER_PAGE;
          
          return (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 text-center">{category}</h4>
              <div className="flex items-center justify-center gap-4">
                 <button
                  onClick={() => handlePrevPage(category)}
                  disabled={disabled || totalPages <= 1}
                  className="p-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--border-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 min-h-[88px]">
                  <div className="flex flex-wrap justify-center gap-3">
                    {/* FIX: Cast `prompts` to `string[]` because it is inferred as `unknown`. */}
                    {(prompts as string[]).slice(startIndex, endIndex).map((suggestion, index) => {
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
                <button
                  onClick={() => handleNextPage(category)}
                  disabled={disabled || totalPages <= 1}
                  className="p-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-full hover:bg-[var(--border-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
              {totalPages > 1 && (
                <div className="text-center mt-3 text-xs text-[var(--text-secondary)]">
                  Page {currentPage + 1} of {totalPages}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};
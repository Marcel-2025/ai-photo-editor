import React, { useState, useMemo, useEffect } from 'react';
import { LightbulbIcon } from './IconComponents';
import { useTheme } from '../contexts/ThemeContext';

interface PromptSuggestionsProps {
  suggestions: { [category: string]: string[] };
  onSelect: (suggestion: string) => void;
  disabled: boolean;
}

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
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const categories = Object.keys(suggestions);
    if (categories.length > 0 && !categories.includes(activeCategory)) {
        setActiveCategory(categories[0]);
    }
  }, [suggestions, activeCategory]);

  if (Object.keys(suggestions).length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="flex items-center justify-center gap-2 mb-6">
        <LightbulbIcon className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Prompt Ideas</h3>
      </div>
      
      {/* Tabs for Mobile/Tablet */}
      <div className="border-b border-[var(--border-secondary)] mb-4 md:hidden">
        <div className="-mb-px flex space-x-4 overflow-x-auto">
            {Object.keys(suggestions).map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeCategory === category
                            ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                            : 'border-transparent text-[var(--text-secondary)] hover:border-gray-300 hover:text-[var(--text-primary)]'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
      </div>
      
      {/* Expanded view for Desktop */}
      <div className="relative md:space-y-8">
        {Object.entries(suggestions).map(([category, prompts]) => (
            <div key={category} className={`
              ${activeCategory === category ? 'block' : 'hidden md:block'}
            `}>
              <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4 text-center hidden md:block">{category}</h4>
              <div className="flex-1 min-h-[88px]">
                  <div className="flex flex-wrap justify-center gap-3">
                    {(prompts as string[]).map((suggestion, index) => {
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
            </div>
        ))}
      </div>
    </div>
  );
};
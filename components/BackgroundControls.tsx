import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { PaletteIcon, ImageIcon } from './IconComponents';

type Background = 'default' | 'aurora' | 'particles';

export const BackgroundControls: React.FC = () => {
  const { background, setBackground } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const backgrounds: { value: Background, label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'aurora', label: 'Aurora' },
    { value: 'particles', label: 'Particles' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Background"
        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg shadow-2xl z-30">
          <div className="p-2">
            <h4 className="px-2 py-1 text-xs font-semibold text-[var(--text-secondary)] uppercase">Background</h4>
            {backgrounds.map(bg => (
              <button
                key={bg.value}
                onClick={() => {
                  setBackground(bg.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                  background === bg.value
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-primary)] hover:bg-[var(--border-primary)]'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
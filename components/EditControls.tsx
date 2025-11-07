import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 shadow-2xl mt-8">
      <div className="relative flex-grow w-full">
        <MagicWandIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <input
          type="text"
          value={prompt}
          onChange={onPromptChange}
          placeholder={t('imageGenerator.promptPlaceholder')}
          className="w-full bg-[var(--background-secondary)] border border-[var(--border-secondary)] rounded-lg py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition-colors"
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
        <button
          onClick={onEdit}
          disabled={isLoading || !prompt.trim()}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--accent-primary)] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--border-primary)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('imageGenerator.generating') : t('imageGenerator.generate')}
        </button>

        <button
          onClick={onUndo}
          title={t('imageGenerator.undo')}
          className="p-3 ml-2 bg-[var(--background-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-primary)] disabled:bg-[var(--background-tertiary)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || !canUndo}
        >
          <UndoIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onRedo}
          title={t('imageGenerator.redo')}
          className="p-3 bg-[var(--background-secondary)] border border-[var(--border-secondary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--border-primary)] disabled:bg-[var(--background-tertiary)] disabled:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
          disabled={isLoading || !canRedo}
        >
          <RedoIcon className="w-6 h-6" />
        </button>
        
         <button
          onClick={onClear}
          title={t('imageGenerator.startOver')}
          className="p-3 bg-[var(--danger-primary)] text-white rounded-lg hover:bg-[var(--danger-primary-hover)] disabled:bg-gray-600 transition-colors"
          disabled={isLoading}
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

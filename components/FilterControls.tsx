import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterIcon } from './IconComponents';

export interface Filter {
  name: string;
  css: string;
}

interface FilterControlsProps {
  filters: Filter[];
  activeFilter: string;
  onSelectFilter: (filterName: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  activeFilter,
  onSelectFilter,
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <FilterIcon className="w-5 h-5 text-[var(--text-secondary)]" />
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {t('imageGenerator.applyFilter')}
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.name}
            onClick={() => onSelectFilter(filter.name)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeFilter === filter.name
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'bg-[var(--background-secondary)] hover:bg-[var(--border-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)]'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

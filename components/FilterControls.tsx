import React from 'react';
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
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 shadow-2xl h-full flex flex-col justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <FilterIcon className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Apply a Filter
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.name}
            onClick={() => onSelectFilter(filter.name)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeFilter === filter.name
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};
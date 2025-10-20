
import React from 'react';
import { SparklesIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AI Photo Editor
          </h1>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { SparklesIcon } from './IconComponents';

interface PremiumModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl font-bold">&times;</button>
        <div className="text-center">
          <SparklesIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Go Premium!</h2>
          <p className="text-gray-400 mb-6">Unlock unlimited photo edits and unleash your creativity without limits.</p>
          <ul className="text-left text-gray-300 space-y-2 mb-8">
            <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Unlimited AI Edits</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Priority Access to New Features</li>
            <li className="flex items-center"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Support Indie Development</li>
          </ul>
          <button 
            onClick={onConfirm}
            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Simulate Purchase with PayPal
          </button>
          <p className="text-xs text-gray-500 mt-4">This is a simulation. No real payment will be processed.</p>
        </div>
      </div>
    </div>
  );
};

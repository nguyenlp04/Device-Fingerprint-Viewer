import React from 'react';
import type { DiffInfo } from '../types';

interface ChangesSectionProps {
  diffInfo: DiffInfo | null;
}

const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') return 'N/A';
  return String(value);
};


export const ChangesSection: React.FC<ChangesSectionProps> = ({ diffInfo }) => {
  if (!diffInfo || Object.keys(diffInfo).length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">Changes Since Last Visit</h2>
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-300">No changes detected since your last visit. Your device fingerprint appears stable.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Changes Since Last Visit</h2>
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        {Object.entries(diffInfo).map(([key, { previous, current }]) => (
          <div key={key} className="bg-gray-900 p-3 rounded-md border border-gray-700">
            <p className="font-semibold text-cyan-400 mb-2">{formatLabel(key)}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-red-400 opacity-70">PREVIOUS</p>
                <p className="text-red-400 break-words">{formatValue(previous)}</p>
              </div>
              <div>
                <p className="text-xs text-green-400 opacity-70">CURRENT</p>
                <p className="text-green-400 break-words">{formatValue(current)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

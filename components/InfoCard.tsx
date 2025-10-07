
import React from 'react';

interface InfoCardProps {
  label: string;
  value: string | number | boolean;
  isHighlighted?: boolean;
}

const formatValue = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return String(value);
};

export const InfoCard: React.FC<InfoCardProps> = ({ label, value, isHighlighted = false }) => {
  const valueStr = formatValue(value);
  const highlightClass = isHighlighted ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700';

  return (
    <div className={`flex justify-between items-center p-3 bg-gray-800 rounded-lg border ${highlightClass} transition-all duration-300`}>
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-sm sm:text-base font-semibold text-right ${isHighlighted ? 'text-cyan-400' : 'text-gray-200'}`}>{valueStr}</p>
    </div>
  );
};

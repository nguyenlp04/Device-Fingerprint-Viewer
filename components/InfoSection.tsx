
import React from 'react';
import type { DeviceInfo } from '../types';
import { InfoCard } from './InfoCard';

interface InfoSectionProps {
  title: string;
  data: DeviceInfo;
  keys: (keyof DeviceInfo)[];
  diffKeys: string[];
}

// A helper to format keys into readable labels
const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export const InfoSection: React.FC<InfoSectionProps> = ({ title, data, keys, diffKeys }) => {
  return (
    <section>
      <h3 className="text-xl font-bold mb-4 border-b-2 border-gray-700 pb-2 text-gray-300">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {keys.map(key => (
          <InfoCard
            key={key}
            label={formatLabel(key)}
            value={data[key]}
            isHighlighted={diffKeys.includes(key)}
          />
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import type { DeviceInfo } from '../types';

interface DeviceListProps {
  devices: { [key: string]: DeviceInfo };
  deviceNames: { [key: string]: string };
  currentFingerprint: string;
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, deviceNames, currentFingerprint }) => {
  const deviceEntries = Object.keys(devices);

  if (deviceEntries.length === 0) {
    return null; // Don't render if no devices are tracked yet
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Tracked Devices</h2>
      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        {deviceEntries.map((fingerprint) => {
          const isCurrent = fingerprint === currentFingerprint;
          const deviceName = deviceNames[fingerprint] || 'Unknown Device';
          const platform = devices[fingerprint]?.platform || 'N/A';
          
          return (
            <div 
              key={fingerprint} 
              className={`
                bg-gray-900 p-3 rounded-md border transition-all duration-300
                ${isCurrent ? 'border-cyan-500 shadow-lg shadow-cyan-500/10' : 'border-gray-700'}
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-semibold ${isCurrent ? 'text-cyan-400' : 'text-gray-200'}`}>{deviceName}</p>
                  <p className="text-xs text-gray-500">{platform}</p>
                </div>
                {isCurrent && (
                   <span className="text-xs font-bold bg-cyan-500 text-gray-900 px-2 py-1 rounded-full">
                    CURRENT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

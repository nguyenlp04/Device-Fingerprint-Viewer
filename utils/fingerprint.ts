
import type { DeviceInfo } from '../types';

// A simple string hashing function (djb2 algorithm)
const hashString = (str: string): string => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; /* hash * 33 + char */
  }
  // Convert to a positive hex string for consistency
  return (hash >>> 0).toString(16);
};

export const generateFingerprint = (info: Omit<DeviceInfo, 'fingerprint'>): string => {
  const components = [
    info.userAgent,
    info.platform,
    info.language,
    info.cpuCores,
    info.memory,
    info.screenResolution,
    info.colorDepth,
    info.pixelDepth,
    info.timezone,
    info.gpuVendor,
    info.gpuRenderer,
  ];

  const combinedString = components.join('||');
  return hashString(combinedString);
};

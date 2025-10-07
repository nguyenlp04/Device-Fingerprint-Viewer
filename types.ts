export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  cpuCores: number;
  memory: number;
  screenResolution: string;
  colorDepth: number;
  pixelDepth: number;
  timezone: string;
  cookiesEnabled: boolean;
  gpuVendor: string;
  gpuRenderer: string;
  publicIp: string;
  localIp: string;
  isOnline: boolean;
  batteryLevel: string;
  isCharging: boolean;
  fingerprint: string;
}

export interface DiffInfo {
  [key: string]: {
    previous: any;
    current: any;
  };
}

export interface DbData {
  devices: { [key: string]: DeviceInfo };
  deviceNames: { [key: string]: string };
}

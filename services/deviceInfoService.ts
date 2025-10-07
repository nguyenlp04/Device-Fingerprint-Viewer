
import type { DeviceInfo } from '../types';

const getPublicIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) return 'Unavailable';
    const data = await response.json();
    return data.ip || 'Unavailable';
  } catch (error) {
    console.error('Error fetching public IP:', error);
    return 'Unavailable';
  }
};

const getLocalIp = (): Promise<string> => {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(pc.setLocalDescription.bind(pc));

    const timeout = setTimeout(() => {
        pc.close();
        resolve('Not available');
    }, 1000);

    pc.onicecandidate = (ice) => {
      if (ice && ice.candidate && ice.candidate.candidate) {
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const ipMatch = ipRegex.exec(ice.candidate.candidate);
        if (ipMatch) {
          clearTimeout(timeout);
          pc.close();
          resolve(ipMatch[1]);
        }
      }
    };
  });
};


const getGpuInfo = (): { vendor: string, renderer: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        };
      }
    }
  } catch (e) {
    // ignore
  }
  return { vendor: 'N/A', renderer: 'N/A' };
};

const getBatteryInfo = async (): Promise<{ level: string, charging: boolean }> => {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      return {
        level: `${Math.round(battery.level * 100)}%`,
        charging: battery.charging,
      };
    }
  } catch (e) {
     // ignore
  }
  return { level: 'N/A', charging: false };
};


export const getDeviceInfo = async (): Promise<Omit<DeviceInfo, 'fingerprint'>> => {
  const [publicIp, localIp, battery] = await Promise.all([
    getPublicIp(),
    getLocalIp(),
    getBatteryInfo()
  ]);
  
  const gpuInfo = getGpuInfo();

  return {
    userAgent: navigator.userAgent || 'N/A',
    platform: navigator.platform || 'N/A',
    language: navigator.language || 'N/A',
    cpuCores: navigator.hardwareConcurrency || 0,
    memory: (navigator as any).deviceMemory || 0,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth || 0,
    pixelDepth: window.screen.pixelDepth || 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A',
    cookiesEnabled: navigator.cookieEnabled,
    gpuVendor: gpuInfo.vendor,
    gpuRenderer: gpuInfo.renderer,
    publicIp,
    localIp,
    isOnline: navigator.onLine,
    batteryLevel: battery.level,
    isCharging: battery.charging,
  };
};

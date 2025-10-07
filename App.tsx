import React, { useState, useEffect } from 'react';
import { getDeviceInfo } from './services/deviceInfoService';
import { syncWithServer } from './services/serverService';
import { generateFingerprint } from './utils/fingerprint';
import type { DeviceInfo, DiffInfo, DbData } from './types';
import { InfoSection } from './components/InfoSection';
import { ChangesSection } from './components/ChangesSection';
import { DeviceList } from './components/DeviceList';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [diffInfo, setDiffInfo] = useState<DiffInfo | null>(null);
  const [allDevices, setAllDevices] = useState<DbData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSyncData = async () => {
      try {
        setLoading(true);
        const info = await getDeviceInfo();
        const fingerprint = generateFingerprint(info);
        const fullInfo = { ...info, fingerprint };
        
        const { diff, db } = syncWithServer(fullInfo);
        
        setDeviceInfo(fullInfo);
        setDiffInfo(diff);
        setAllDevices(db);
      } catch (err) {
        console.error("Failed to gather device information:", err);
        setError("Could not retrieve all device information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSyncData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Spinner />
          <p className="mt-4 text-lg text-gray-400">Analyzing your device...</p>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-400 p-8">{error}</div>;
    }

    if (!deviceInfo || !allDevices) {
      return <div className="text-center text-gray-400 p-8">No device information available.</div>;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 md:p-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-cyan-400">Current Device Information</h2>
          <div className="space-y-6">
            <InfoSection title="Network" data={deviceInfo} keys={['publicIp', 'localIp', 'isOnline']} diffKeys={Object.keys(diffInfo || {})} />
            <InfoSection title="Device & OS" data={deviceInfo} keys={['userAgent', 'platform', 'cpuCores', 'memory', 'language']} diffKeys={Object.keys(diffInfo || {})} />
            <InfoSection title="Display & Graphics" data={deviceInfo} keys={['screenResolution', 'colorDepth', 'pixelDepth', 'gpuRenderer', 'gpuVendor']} diffKeys={Object.keys(diffInfo || {})} />
            <InfoSection title="Browser" data={deviceInfo} keys={['timezone', 'cookiesEnabled', 'fingerprint']} diffKeys={Object.keys(diffInfo || {})} />
            <InfoSection title="Battery" data={deviceInfo} keys={['batteryLevel', 'isCharging']} diffKeys={Object.keys(diffInfo || {})} />
          </div>
        </div>
        <div className="sticky top-24 self-start">
          <DeviceList 
            devices={allDevices.devices}
            deviceNames={allDevices.deviceNames}
            currentFingerprint={deviceInfo.fingerprint}
          />
          <ChangesSection diffInfo={diffInfo} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 shadow-lg shadow-black/20">
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-white">
          <span className="text-cyan-400">Device</span> Fingerprint Viewer
        </h1>
      </header>
      <main>
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm border-t border-gray-700 mt-8">
        <p>&copy; {new Date().getFullYear()} Device Fingerprint Viewer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;

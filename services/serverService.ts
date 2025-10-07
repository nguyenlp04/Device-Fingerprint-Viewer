import type { DeviceInfo, DiffInfo, DbData } from '../types';

const DB_KEY = 'deviceFingerprintData'; // Use a new key for the new structure
const OLD_DB_KEY = 'deviceHistory';

const getDbData = (): DbData => {
  const emptyDb: DbData = { devices: {}, deviceNames: {} };

  try {
    // 1. Try to load from the new key
    const storedData = localStorage.getItem(DB_KEY);
    if (storedData) {
      const data = JSON.parse(storedData);
      // Basic validation
      if (data.devices && data.deviceNames) {
        return data;
      }
    }

    // 2. If new key not found or invalid, try to migrate from the old key
    const oldStoredData = localStorage.getItem(OLD_DB_KEY);
    if (oldStoredData) {
      console.log('Migrating data from old key...');
      const oldData = JSON.parse(oldStoredData);
      const migratedDb: DbData = { devices: oldData, deviceNames: {} };
      Object.keys(oldData).forEach((fingerprint, index) => {
        migratedDb.deviceNames[fingerprint] = `Device ${index + 1}`;
      });
      // Save to new location and remove old one
      localStorage.setItem(DB_KEY, JSON.stringify(migratedDb));
      localStorage.removeItem(OLD_DB_KEY);
      return migratedDb;
    }
  } catch (error) {
    console.error("Failed to read or migrate data from localStorage:", error);
  }

  return emptyDb;
};


const saveDbData = (db: DbData) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Failed to write to localStorage:", error);
  }
};


export const syncWithServer = (currentInfo: DeviceInfo): { diff: DiffInfo | null; db: DbData } => {
  const db = getDbData();
  const fingerprint = currentInfo.fingerprint;
  const previousInfo = db.devices[fingerprint];

  // If it's a new device, prompt for a name.
  if (!previousInfo) {
    const defaultName = `Device ${Object.keys(db.devices).length + 1}`;
    const deviceName = prompt(
        "A new device signature has been detected. Please enter a name for this device:",
        defaultName
    );
    db.deviceNames[fingerprint] = deviceName || defaultName;
  }

  let diff: DiffInfo = {};
  if (previousInfo) {
    for (const key in currentInfo) {
      const typedKey = key as keyof DeviceInfo;
      if (currentInfo[typedKey] !== previousInfo[typedKey]) {
        diff[typedKey] = {
          previous: previousInfo[typedKey],
          current: currentInfo[typedKey],
        };
      }
    }
  }

  // Save current info as the latest record for this fingerprint
  db.devices[fingerprint] = currentInfo;
  saveDbData(db);

  const finalDiff = Object.keys(diff).length > 0 ? diff : null;
  return { diff: finalDiff, db };
};

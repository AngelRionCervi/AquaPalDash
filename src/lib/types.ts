export type ScheduleRange = [number, number];
export type ScheduleRangeLabels = [string, string];
export type Schedule = ScheduleRange | boolean;

export interface WifiNetwork {
  ssid: string;
  rssi: number;
  channel: number;
  encryptionType: string;
  fingerprint: string;
}

export interface RawDeviceStatus {
  id: string;
  name: string;
  state: boolean;
  isOnline: boolean;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  smartPlugType: SmartPlugs;
  button: number;
  schedule: Schedule;
  isUnsaved?: boolean;
  toBeRemoved?: boolean;
  isModified?: boolean;
}

export interface ConfigSecrets {
  [key: string]: string;
  wifiSSID: string;
  wifiPass: string;
  serverPass: string;
}

export interface ConfigSettings {
  [key: string]: string | number | boolean | PhCalibrationSettings;
  autoSchedulesOnAfter: number;
  prefetchHistorical: boolean;
  theme: 'light' | 'dark';
  tempUnit: 'celsius' | 'fahrenheit';
  timeFormat: '24h' | '12h';
  aquariumLabel: string;
  enableMonitoring: boolean;
  phCalibration: PhCalibrationSettings;
}

export interface Config {
  devices: Array<Device>;
  secrets: ConfigSecrets;
  settings: ConfigSettings;
}

export type SmartPlugs = 'shelly_plug_s' | 'tasmota_plug';

export type CalibrationType = 'ph';

export interface CalibrationTable {
  type: CalibrationType;
  label: string;
  validateLabel: string;
  steplabels: Array<string>;
  unit: string;
  max?: number;
  min?: number;
}

export interface PhCalibrationSettings {
  ph4Mv: number;
  ph7Mv: number;
}

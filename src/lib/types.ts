type ScheduleRange = [number, number];
type Schedule = ScheduleRange | boolean;

interface RawDeviceStatus {
  id: string;
	name: string;
	state: boolean;
	isOnline: boolean;
}

interface Device {
  id: string;
	name: string;
	ip: string;
	button: number;
	schedule: Schedule;
  isUnsaved?: boolean;
  toBeRemoved?: boolean;
}

interface ConfigSecrets {
	wifiSSID: string;
	wifiPass: string;
	serverPass: string;
}

interface ConfigSettings {
	autoSchedulesOnAfter: number;
	prefetchHistorical: boolean;
	theme: 'light' | 'dark';
	tempUnit: 'celsius' | 'fahrenheit';
	aquariumLabel: string;
}

interface Config {
	devices: Array<Device>;
	secrets: ConfigSecrets;
	settings: ConfigSettings;
}

interface ApiResponse {
	status: 'error' | 'success';
	message?: string;
	data?: any;
}

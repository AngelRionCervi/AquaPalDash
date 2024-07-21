type ScheduleRange = [number, number];
type Schedule = ScheduleRange | boolean;

interface RawDeviceStatus {
	name: string;
	state: boolean;
	isOnline: boolean;
}

interface Device {
	name: string;
	ip: string;
	button: number;
	schedule: ScheduleRange;
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
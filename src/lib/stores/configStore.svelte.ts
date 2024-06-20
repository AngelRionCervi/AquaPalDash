import ConfigApi from '$lib/api/configApi';

interface CallState {
	isLoading?: boolean;
	error?: string;
}

interface ConfigState {
	config: Config | null;
	isSync: boolean;
	callStates: Record<Exclude<keyof ConfigStore, 'config' | 'isSync' | 'checkSync'>, CallState>;
}

interface ConfigStore {
	config: Config | null;
	isSync: boolean;
	fetchAndSetConfig: () => Promise<void>;
	updateDevice: (name: string, partialDevice: Partial<Device>) => void;
	updateSetting: (key: keyof ConfigSettings, value: ConfigSettings[T]) => void;
	updateSecret: (key: keyof ConfigSecrets, value: ConfigSecrets[T]) => void;
	checkSync: () => void;
}

const callStates: ConfigState['callStates'] = $state({
	fetchAndSetConfig: {},
	updateDevice: {},
	updateSetting: {},
	updateSecret: {}
});
const defaultConfigStoreValue: ConfigState = { config: null, isSync: false, callStates };

const configState = $state<ConfigState>(defaultConfigStoreValue);
let previousConfig: Config | null = null;

const configStore: ConfigStore = {
	get config() {
		return configState.config;
	},
	get isSync() {
		return configState.isSync;
	},
	async fetchAndSetConfig() {
		try {
			callStates.fetchAndSetConfig.isLoading = true;
			const newConfig = await ConfigApi.fetchConfig();
			configState.config = newConfig;
			previousConfig = Object.freeze(structuredClone(newConfig));
			configState.isSync = true;
			console.log('config', newConfig);
		} catch (err) {
			callStates.fetchAndSetConfig.error = err.message;
		} finally {
			callStates.fetchAndSetConfig.isLoading = false;
		}
	},
	updateDevice(name: string, partialDevice: Partial<Device>) {
		if (!configState.config) return;

		const devices = configState.config.devices;
		const corDeviceIndex = devices.findIndex((device) => (device.name = name));

		if (corDeviceIndex === -1) {
			const message = 'No device to update found.';
			console.error(message);
			callStates.updateDevice.error = message;
			return;
		}

		const newDevice = { ...configState.config.devices[corDeviceIndex], ...partialDevice };

		if (!checkDeviceIntegrity(newDevice)) {
			const message = 'Wrong device payload.';
			console.error(message, newDevice);
			callStates.updateDevice.error = message;
			return;
		}

		configState.config.devices[corDeviceIndex] = newDevice;
		configStore.checkSync();
	},
	updateSetting<T extends keyof ConfigSettings>(key: T, value: ConfigSettings[T]) {
		if (!configState.config) return;

		if (!validateKey('settings', key)) {
			const message = 'Wrong setting.';
			console.error(message);
			callStates.updateSetting.error = message;
			return;
		}

		configState.config.settings[key] = value;
		configStore.checkSync();
	},
	updateSecret<T extends keyof ConfigSecrets>(key: T, value: ConfigSecrets[T]) {
		if (!configState.config) return;

		if (!validateKey('secrets', key)) {
			const message = 'Wrong setting.';
			console.error(message);
			callStates.updateSecret.error = message;
			return;
		}

		configState.config.secrets[key] = value;
		configStore.checkSync();
	},
	checkSync() {
		if (!configState.config || !previousConfig) {
			configState.isSync = false;
			return;
		}

		const newConfig = configState.config;

		if (newConfig.devices.length !== previousConfig.devices.length) {
			configState.isSync = false;
			return;
		}

		let newSync = true;

		for (let i = 0; i < newConfig.devices.length - 1; i++) {
			const newDevice = newConfig.devices[i];
			const prevDevice = previousConfig.devices.find(({ name }) => name === newDevice.name);

			if (!prevDevice) {
				newSync = false;
				break;
			}

			if (
				prevDevice.ip !== newDevice.ip ||
				prevDevice.button !== newDevice.button ||
				prevDevice.schedule[0] !== newDevice.schedule[0] ||
				prevDevice.schedule[1] !== newDevice.schedule[1]
			) {
				newSync = false;
				break;
			}
		}

		let settingsCheck = true;
		let secretsCheck = true;

		Object.entries(newConfig.settings).forEach(([key, value]) => {
			if (previousConfig?.settings?.[key as keyof ConfigSettings] !== value) {
				settingsCheck = false;
			}
		});

		Object.entries(newConfig.secrets).forEach(([key, value]) => {
			if (previousConfig?.secrets?.[key as keyof ConfigSecrets] !== value) {
				secretsCheck = false;
			}
		});

		if (!settingsCheck || !secretsCheck) {
			newSync = false;
		}

		configState.isSync = newSync;
	}
};

function validateKey(
	type: 'settings' | 'secrets',
	key: keyof ConfigSettings | keyof ConfigSecrets
) {
	const settingsKeys: Array<keyof ConfigSettings> = [
		'autoSchedulesOnAfter',
		'prefetchHistorical',
		'theme',
		'tempUnit',
		'aquariumLabel'
	];

	const secretsKeys: Array<keyof ConfigSecrets> = ['wifiSSID', 'wifiPass', 'serverPass'];

	const allKeys = { settings: settingsKeys, secrets: secretsKeys };
	return allKeys[type].some((possibleKey) => possibleKey === key);
}

function validateTruthyString(str: string) {
	return typeof str === 'string' && str.length;
}

function validateNumber(nbr: number) {
	return typeof nbr === 'number';
}

function validateSchedule(schedule: ScheduleRange | boolean) {
	if (Array.isArray(schedule)) {
		return validateNumber(schedule[0]) && validateNumber(schedule[1]);
	} else {
		return typeof schedule === 'boolean';
	}
}

function checkDeviceIntegrity(device: Device) {
	return (
		validateTruthyString(device.name) &&
		validateTruthyString(device.ip) &&
		validateNumber(device.button) &&
		validateSchedule(device.schedule)
	);
}

export default configStore;

import ConfigApi from '$lib/api/configApi';
import controllerStore from './controllerStore.svelte';

interface CallState {
	isLoading?: boolean;
	error?: string;
}

interface ConfigState {
	config: Config | null;
	isSync: boolean;
	callStates: Record<
		Exclude<
			keyof ConfigStore,
			'config' | 'isSync' | 'checkSync' | 'callStates' | 'undoModifications'
		>,
		CallState
	>;
}

interface ConfigStore {
	config: Config | null;
	isSync: boolean;
	callStates: ConfigState['callStates'];
	undoModifications: () => void;
	fetchAndSetConfig: () => Promise<void>;
	updateDevice: (name: string, partialDevice: Partial<Device>) => void;
	updateSetting: <T extends keyof ConfigSettings>(
		key: keyof ConfigSettings,
		value: ConfigSettings[T]
	) => void;
	updateSecret: <T extends keyof ConfigSecrets>(
		key: keyof ConfigSecrets,
		value: ConfigSecrets[T]
	) => void;
	checkSync: () => void;
	uploadNewConfig: () => void;
}

const callStates: ConfigState['callStates'] = $state({
	fetchAndSetConfig: {},
	updateDevice: {},
	updateSetting: {},
	updateSecret: {},
	uploadNewConfig: {}
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
	get callStates() {
		return configState.callStates;
	},
	async fetchAndSetConfig() {
		try {
			callStates.fetchAndSetConfig.isLoading = true;
			const newConfig = await ConfigApi.fetchConfig();
			if (newConfig?.status === 'error' || !newConfig?.data) {
				callStates.uploadNewConfig.error = newConfig?.message || 'no data';
			} else {
				configState.config = newConfig.data;
				previousConfig = Object.freeze(structuredClone(newConfig.data));
				configState.isSync = true;
				console.log('config', newConfig);
			}
		} catch (err) {
			callStates.fetchAndSetConfig.error = err.message;
		} finally {
			callStates.fetchAndSetConfig.isLoading = false;
		}
	},
	async uploadNewConfig() {
		if (!configState.config) return;
		try {
			callStates.uploadNewConfig.isLoading = true;
			const uploadResult = await ConfigApi.uploadConfig(configState.config);

			if (uploadResult?.status === 'error') {
				callStates.uploadNewConfig.error = uploadResult.message;
				console.error('upload new config error', uploadResult.message);
			} else {
				await controllerStore.restartController();
				await configStore.fetchAndSetConfig();
			}
		} catch (err) {
			callStates.uploadNewConfig.error = err;
		} finally {
			callStates.uploadNewConfig.isLoading = false;
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

		console.log('update setting', key, value);

		if (!validateKey('settings', key)) {
			const message = 'Wrong setting.';
			console.error(message);
			callStates.updateSetting.error = message;
			return;
		}

		configState.config.settings[key] = value;

		console.log('configState.config.settings[key]', configState.config.settings[key]);
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
	undoModifications() {
		if (!configState.config || !previousConfig) return;

		configState.config = structuredClone(previousConfig);
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

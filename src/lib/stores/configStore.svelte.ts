import ConfigApi from '$lib/api/configApi';
import { MAX_DEVICES } from '$lib/constants';
import controllerStore from './controllerStore.svelte';
import configMock from '$lib/mock/configMock.json';

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
			| 'config'
			| 'isSync'
			| 'checkSync'
			| 'callStates'
			| 'undoModifications'
			| 'prepareConfigForUpload'
      | 'loadMockConfig'
      | 'updateMockConfig'
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
	updateDevice: (id: string, partialDevice: Partial<Device>) => void;
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
	addDevice: (newDevice: Device) => void;
	removeDevices: (id: string | Array<string>) => void;
	prepareConfigForUpload: () => Config | undefined;
  loadMockConfig: () => void;
  updateMockConfig: () => void;
}

const callStates: ConfigState['callStates'] = $state({
	fetchAndSetConfig: {},
	updateDevice: {},
	updateSetting: {},
	updateSecret: {},
	uploadNewConfig: {},
	addDevice: {},
	removeDevices: {}
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
				const message = newConfig?.message || 'no data';
				callStates.uploadNewConfig.error = message;
				throw new Error(message);
			} else {
				configState.config = newConfig.data;
				console.log('newConfig.data', newConfig.data);
				previousConfig = Object.freeze(structuredClone(newConfig.data));
				configState.isSync = true;
				console.log('config', newConfig);
			}
		} catch (err) {
			callStates.fetchAndSetConfig.error = err.message;
			console.error('fetch and set config error', err);
		} finally {
			callStates.fetchAndSetConfig.isLoading = false;
		}
	},
	async uploadNewConfig() {
		if (!configState.config) return;

		try {
			callStates.uploadNewConfig.isLoading = true;
			const cleanConfig = configStore.prepareConfigForUpload();
			if (!cleanConfig) {
				throw new Error('Could not clean config.');
			}
			const uploadResult = await ConfigApi.uploadConfig(cleanConfig);

			if (uploadResult?.status === 'error') {
				callStates.uploadNewConfig.error = uploadResult.message;
				throw new Error(uploadResult.message);
			} else {
				await controllerStore.restartController();
				await configStore.fetchAndSetConfig();
			}
		} catch (err) {
			callStates.uploadNewConfig.error = err;
			console.error('upload new config error', err);
		} finally {
			callStates.uploadNewConfig.isLoading = false;
		}
	},
	prepareConfigForUpload() {
		if (!configState.config) return;

		const config = JSON.parse(JSON.stringify(configState.config));
		console.log('prepareConfigForUpload', config);

		for (let i = config?.devices.length - 1; i >= 0; i--) {
			const device = config?.devices[i];
			if (device?.toBeRemoved) {
				config?.devices.splice(i, 1);
			}
			delete device?.isUnsaved;
		}

		return config;
	},
	updateDevice(id: string, partialDevice: Partial<Device>) {
		if (!configState.config) return;

		const devices = configState.config.devices;
		const corDeviceIndex = devices.findIndex((device) => device.id === id);

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
	addDevice(newDevice: Device) {
		if (!configState.config) return;

		const devices = configState.config.devices;

		if (devices.length >= MAX_DEVICES) {
			const message = 'Maximum number of devices reached.';
			console.error(message);
			callStates.addDevice.error = message;
			return;
		}

		if (!checkDeviceIntegrity(newDevice)) {
			const message = 'Wrong device payload.';
			console.error(message, newDevice);
			callStates.addDevice.error = message;
			return;
		}

		newDevice.isUnsaved = true;

		configState.config.devices = [...devices, newDevice];
		configStore.checkSync();
	},
	removeDevices(ids: string | Array<string>) {
		if (!configState.config) return;

		const idList = [ids].flat();
		const devices = configState.config.devices;

		idList.forEach((id) => {
			const corDevice = devices.find((device) => device.id === id);

			if (corDevice) {
				if (corDevice.isUnsaved && configState.config) {
					configState.config.devices = devices.filter((device) => device.id !== id);
				} else {
					corDevice.toBeRemoved = true;
				}
			}
		});

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

		for (let i = 0; i < newConfig.devices.length; i++) {
			const newDevice = newConfig.devices[i];
			const prevDevice = previousConfig.devices.find(({ id }) => id === newDevice.id);

			if (!prevDevice) {
				newSync = false;
				break;
			}

			if (newDevice.toBeRemoved || newDevice.isUnsaved) {
				newSync = false;
				break;
			}

			if (prevDevice.schedule.toString() !== newDevice.schedule.toString()) {
				newSync = false;
				break;
			}

      if (prevDevice.name !== newDevice.name) {
				newSync = false;
				break;
			}

			if (prevDevice.ip !== newDevice.ip || prevDevice.button !== newDevice.button) {
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
	},
  loadMockConfig() {
    console.log('loadMockConfig', configMock);
    configState.config = structuredClone(configMock);
    previousConfig = Object.freeze(structuredClone(configMock));
    configState.isSync = true;
  },
  updateMockConfig() {
    const cleanConfig = configStore.prepareConfigForUpload();
    configState.config = structuredClone(cleanConfig);
    previousConfig = Object.freeze(structuredClone(cleanConfig));
    configState.isSync = true;
  },
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
		'aquariumLabel',
    'enableMonitoring'
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
    validateTruthyString(device.id) &&
		validateTruthyString(device.name) &&
		validateTruthyString(device.ip) &&
		validateNumber(device.button) &&
		validateSchedule(device.schedule)
	);
}

export default configStore;

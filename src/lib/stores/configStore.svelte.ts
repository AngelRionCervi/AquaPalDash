import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';
import { MAX_DEVICES, SMART_PLUG_TYPES } from '$lib/constants';
import configMock from '$lib/mock/configMock.json';
import { sendWSMessage } from '$lib/wsClient/WSClientHandler';
import type { Config, ConfigSecrets, ConfigSettings, Device, Schedule, SmartPlugs } from '$lib/types';
import { objectCompare } from '$lib/helpers/objects';

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
      | 'handleConfigUpdated'
      | 'setConfig'
      | 'queryConfig'
      | 'checkDeviceSync'
      | 'revertDevice'
    >,
    CallState
  >;
}

interface ConfigStore {
  config: Config | null;
  isSync: boolean;
  callStates: ConfigState['callStates'];
  setConfig: (newConfig: Config) => void;
  undoModifications: () => void;
  updateDevice: (id: string, partialDevice: Partial<Device>) => void;
  updateSetting: <T extends keyof ConfigSettings>(key: keyof ConfigSettings, value: ConfigSettings[T]) => void;
  updateSecret: <T extends keyof ConfigSecrets>(key: keyof ConfigSecrets, value: ConfigSecrets[T]) => void;
  checkSync: () => void;
  uploadNewConfig: () => void;
  addDevice: (newDevice: Device) => void;
  removeDevices: (id: string | Array<string>) => void;
  prepareConfigForUpload: () => Config | undefined;
  loadMockConfig: () => void;
  updateMockConfig: () => void;
  handleConfigUpdated: () => void;
  queryConfig: () => void;
  checkDeviceSync: (oldDevice: Device, newDevice: Device) => boolean;
  revertDevice: (id: string) => void;
}

const callStates: ConfigState['callStates'] = $state({
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
  setConfig(newConfig: Config) {
    configState.config = newConfig;
    console.log('newConfig', newConfig);
    previousConfig = Object.freeze(structuredClone(newConfig));
    configState.isSync = true;
  },
  queryConfig() {
    sendWSMessage({ type: DASH_CALL_TYPES.dash_getConfigType });
  },
  uploadNewConfig() {
    if (!configState.config) return;
    const cleanConfig = configStore.prepareConfigForUpload();
    if (!cleanConfig) {
      throw new Error('Could not clean config.');
    }
    callStates.uploadNewConfig.isLoading = true;
    sendWSMessage({ type: DASH_CALL_TYPES.dash_updateConfigType, data: cleanConfig });
  },
  handleConfigUpdated() {
    callStates.uploadNewConfig.isLoading = false;
  },
  prepareConfigForUpload() {
    if (!configState.config) return;

    const config = JSON.parse(JSON.stringify(configState.config));

    for (let i = config?.devices.length - 1; i >= 0; i--) {
      const device = config?.devices[i];
      if (device?.toBeRemoved) {
        config?.devices.splice(i, 1);
      }
      delete device?.isUnsaved;
      delete device?.isModified;
    }

    return config;
  },
  updateDevice(id: string, partialDevice: Partial<Device>) {
    if (!configState.config) return;

    const devices = configState.config.devices;
    const corDeviceIndex = devices.findIndex((device) => device.id === id);
    const oldDevice = previousConfig?.devices.find((device) => device.id === id);

    if (corDeviceIndex === -1 || !oldDevice) {
      const message = 'No device to update found.';
      console.error(message);
      callStates.updateDevice.error = message;
      return;
    }

    const corDevice = devices[corDeviceIndex];
    const newDevice: Device = { ...corDevice, ...partialDevice };

    const isModified = !configStore.checkDeviceSync(oldDevice, newDevice);
    newDevice.isModified = isModified;

    if (!checkDeviceIntegrity(newDevice)) {
      const message = 'Wrong device payload.';
      console.error(message, newDevice);
      callStates.updateDevice.error = message;
      return;
    }

    configState.config.devices[corDeviceIndex] = newDevice;
    configStore.checkSync();
  },
  revertDevice(id: string) {
    if (!configState.config) return;

    const devices = configState.config.devices;
    const corDeviceIndex = devices.findIndex((device) => device.id === id);
    const oldDevice = previousConfig?.devices.find((device) => device.id === id);

    if (corDeviceIndex > -1 && !oldDevice) {
      configState.config.devices.splice(corDeviceIndex, 1);
      return;
    }

    if (corDeviceIndex === -1 || !oldDevice) {
      const message = 'No device to revert found.';
      console.error(message);
      callStates.updateDevice.error = message;
      return;
    }

    configState.config.devices[corDeviceIndex] = structuredClone(oldDevice);
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
      const message = 'Wrong device payload !';
      console.error(message, newDevice);
      callStates.addDevice.error = message;
      return;
    }

    newDevice.isUnsaved = true;
    console.log('newDevice', newDevice);

    configState.config.devices = [...devices, newDevice];
    configStore.checkSync();
  },
  removeDevices(ids: string | Array<string>) {
    if (!configState.config) return;

    const idList = [ids].flat();
    const devices = configState.config.devices;

    idList.forEach((id) => {
      const corDevice = devices.find((device) => device.id === id);
      console.log('removeDevices', corDevice);
      if (corDevice) {
        if (corDevice.isUnsaved && configState.config) {
          configState.config.devices = devices.filter((device) => device.id !== id);
        } else {
          corDevice.toBeRemoved = true;
          corDevice.isModified = true;
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
  checkDeviceSync(oldDevice: Device, newDevice: Device) {
    if (newDevice.toBeRemoved || newDevice.isUnsaved || newDevice.isModified) return false;

    return (
      oldDevice.schedule.toString() === newDevice.schedule.toString() &&
      oldDevice.name === newDevice.name &&
      oldDevice.ip === newDevice.ip &&
      oldDevice.button === newDevice.button &&
      oldDevice.smartPlugType === newDevice.smartPlugType
    );
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

      newSync = configStore.checkDeviceSync(prevDevice, newDevice);

      if (!newSync) {
        break;
      }
    }

    if (!newSync) {
      configState.isSync = false;
      return;
    }

    const settingsCheck = objectCompare(newConfig.settings, previousConfig.settings);
    const secretsCheck = objectCompare(newConfig.secrets, previousConfig.secrets);

    if (!settingsCheck || !secretsCheck) {
      newSync = false;
    }

    configState.isSync = newSync;
  },
  loadMockConfig() {
    configState.config = structuredClone(configMock) as Config;
    previousConfig = Object.freeze(structuredClone(configMock)) as Config;
    configState.isSync = true;
  },
  updateMockConfig() {
    const cleanConfig = configStore.prepareConfigForUpload();
    configState.config = structuredClone(cleanConfig) as Config;
    previousConfig = Object.freeze(structuredClone(cleanConfig)) as Config;
    configState.isSync = true;
  }
};

function validateKey(type: 'settings' | 'secrets', key: keyof ConfigSettings | keyof ConfigSecrets) {
  const settingsKeys: Array<keyof ConfigSettings> = [
    'autoSchedulesOnAfter',
    'prefetchHistorical',
    'timeFormat',
    'theme',
    'tempUnit',
    'aquariumLabel',
    'enableMonitoring',
    'phCalibration'
  ];

  const secretsKeys: Array<keyof ConfigSecrets> = ['wifiSSID', 'wifiPass'];

  const allKeys = { settings: settingsKeys, secrets: secretsKeys };
  return allKeys[type].some((possibleKey) => possibleKey === key);
}

function validateTruthyString(str: string) {
  return typeof str === 'string' && str.length;
}

function validateNumber(nbr: number) {
  return typeof nbr === 'number';
}

function validateSmartPluType(type: string) {
  return SMART_PLUG_TYPES.map((plug) => plug.value).includes(type as SmartPlugs);
}

function validateSchedule(schedule: Schedule) {
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
    validateSchedule(device.schedule) &&
    validateSmartPluType(device.smartPlugType)
  );
}

export default configStore;

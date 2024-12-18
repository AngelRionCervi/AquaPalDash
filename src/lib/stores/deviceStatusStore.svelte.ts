import devicesStatusMock from '$lib/mock/devicesStatusMock.json';
import type { RawDeviceStatus } from '$lib/types';

interface DeviceStatus {
  id: string | null;
	name: string | null;
	isOn: boolean | null;
	isConnected: boolean | null;
}

interface DevicesStatusState {
	devices: DeviceStatus[];
	lastGlobalUpdate: number | null;
}

interface DevicesStatusStore {
	getDeviceStatus: (id: string) => DeviceStatus | undefined;
	updateAllDevicesStatus: (devicesStatus: RawDeviceStatus[]) => void;
  updateDeviceState: (id: string, state: boolean) => void;
  loadDeviceStatusMock: () => void;
}

const defaultDeviceStoreValue: DevicesStatusState = Object.freeze({
	devices: [],
	lastGlobalUpdate: null
});

const deviceStatusState = $state<DevicesStatusState>(structuredClone(defaultDeviceStoreValue));

const devicesStatusStore: DevicesStatusStore = {
	getDeviceStatus(id: string) {
		return deviceStatusState.devices.find((device) => device.id === id);
	},
	updateAllDevicesStatus(devicesStatus: RawDeviceStatus[]) {
    if (!devicesStatus.length) return;
    
		deviceStatusState.devices = devicesStatus.map(({ id, name, isOnline, state }) => ({
      id,
			name,
			isOn: state,
			isConnected: isOnline
		}));
		deviceStatusState.lastGlobalUpdate = Date.now();
	},
  updateDeviceState(id: string, state: boolean) {
    const deviceStatus = devicesStatusStore.getDeviceStatus(id);
    if (deviceStatus) {
      deviceStatus.isOn = state;
    }
  },
  loadDeviceStatusMock() {
    devicesStatusStore.updateAllDevicesStatus(devicesStatusMock);
  }
};

export default devicesStatusStore;

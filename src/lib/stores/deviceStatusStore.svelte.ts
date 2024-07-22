interface DeviceStatus {
	name: string | null;
	isOn: boolean | null;
	isConnected: boolean | null;
}

interface DevicesStatusState {
	devices: DeviceStatus[];
	lastGlobalUpdate: number | null;
}

interface DevicesStatusStore {
	getDeviceStatus: (name: string) => DeviceStatus | undefined;
	updateAllDevicesStatus: (devicesStatus: RawDeviceStatus[]) => void;
  updateDeviceState: (name: string, state: boolean) => void;
}

const defaultDeviceStoreValue: DevicesStatusState = Object.freeze({
	devices: [],
	lastGlobalUpdate: null
});

const deviceStatusState = $state<DevicesStatusState>(structuredClone(defaultDeviceStoreValue));

const devicesStatusStore: DevicesStatusStore = {
	getDeviceStatus(name: string) {
		return deviceStatusState.devices.find((device) => device.name === name);
	},
	updateAllDevicesStatus(devicesStatus: RawDeviceStatus[]) {
		deviceStatusState.devices = devicesStatus.map(({ name, isOnline, state }) => ({
			name,
			isOn: state,
			isConnected: isOnline
		}));
		deviceStatusState.lastGlobalUpdate = Date.now();
	},
  updateDeviceState(name: string, state: boolean) {
    const deviceStatus = devicesStatusStore.getDeviceStatus(name);
    if (deviceStatus) {
      deviceStatus.isOn = state;
    }
  }
};

export default devicesStatusStore;

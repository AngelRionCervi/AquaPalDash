interface DeviceStatus {
	name: string | null;
	isOn: boolean | null;
	isConnected: boolean | null;
}

interface DevicesStatusState {
	devices: DeviceStatus[];
	lastUpdate: number | null;
}

interface DevicesStatusStore {
	getDeviceStatus: (name: string) => DeviceStatus | undefined;
	updateDevicesStatus: (devicesStatus: RawDeviceStatus[]) => void;
}

const defaultDeviceStoreValue: DevicesStatusState = Object.freeze({
	devices: [],
	lastUpdate: null
});

const deviceStatusState = $state<DevicesStatusState>(structuredClone(defaultDeviceStoreValue));

const devicesStatusStore: DevicesStatusStore = {
	getDeviceStatus(name: string) {
		return deviceStatusState.devices.find((device) => device.name === name);
	},
	updateDevicesStatus(devicesStatus: RawDeviceStatus[]) {
		deviceStatusState.devices = devicesStatus.map(({ name, isOnline, state }) => ({
			name,
			isOn: state,
			isConnected: isOnline
		}));
		deviceStatusState.lastUpdate = Date.now();
	}
};

export default devicesStatusStore;

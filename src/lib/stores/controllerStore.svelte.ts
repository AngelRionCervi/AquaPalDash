import ControllerApi from '$lib/api/controllerApi';
import devicesStatusStore from './deviceStatusStore.svelte';
import { CHECK_CONNECTION_INTERVAL } from '$lib/constants';
import { sleep } from '$lib/helpers/utils';

interface CallState {
	isLoading?: boolean;
	error?: string;
}

type BasicCallStates = Record<
	Exclude<
		keyof ControllerStore,
		| 'isRestarting'
		| 'isOn'
		| 'isScheduleOn'
		| 'callStates'
		| 'checkUpdateWithInterval'
		| 'clearCheckUpdateWithInterval'
		| 'restartController'
		| 'toggleDeviceSchedule'
		| 'deviceCallStates'
	>,
	CallState
>;

interface ControllerState {
	isRestarting: boolean;
	isOn: boolean;
	isScheduleOn: boolean;
	checkUpdateWithInterval: number;
	callStates: BasicCallStates;
	deviceCallStates: Record<string, CallState>;
}

interface ControllerStore {
	isRestarting: ControllerState['isRestarting'];
	isOn: ControllerState['isOn'];
	isScheduleOn: ControllerState['isScheduleOn'];
	callStates: ControllerState['callStates'];
	deviceCallStates: ControllerState['deviceCallStates'];
	restartController: () => Promise<void>;
	checkUpdateWithInterval: () => void;
	clearCheckUpdateWithInterval: () => void;
	checkHardwareUpdate: () => Promise<void>;
	toggleSchedule: () => Promise<void>;
	toggleDeviceSchedule: (name: string) => Promise<void>;
}

const callStates: ControllerState['callStates'] = $state({
	checkHardwareUpdate: {},
	toggleSchedule: {}
});

const deviceCallStates: ControllerState['deviceCallStates'] = $state({});

const defaultControllerStoreValue: ControllerState = {
	isRestarting: false,
	isOn: false,
	isScheduleOn: false,
	checkUpdateWithInterval: 0,
	callStates,
	deviceCallStates
};

const constrollerState = $state<ControllerState>(defaultControllerStoreValue);

const controllerStore: ControllerStore = {
	get isRestarting() {
		return constrollerState.isRestarting;
	},
	get isOn() {
		return constrollerState.isOn;
	},
	get isScheduleOn() {
		return constrollerState.isScheduleOn;
	},
	get callStates() {
		return constrollerState.callStates;
	},
	get deviceCallStates() {
		return constrollerState.deviceCallStates;
	},
	checkUpdateWithInterval() {
		constrollerState.checkUpdateWithInterval = setInterval(() => {
			controllerStore.checkHardwareUpdate();
		}, CHECK_CONNECTION_INTERVAL);
	},
	clearCheckUpdateWithInterval() {
		clearInterval(constrollerState.checkUpdateWithInterval);
		constrollerState.checkUpdateWithInterval = 0;
	},
	async toggleSchedule() {
		callStates.toggleSchedule.isLoading = true;
		const result = await ControllerApi.API_toggleSchedule();
		console.log('toggleSchedule', result.newState);
		constrollerState.isScheduleOn = !result.newState;
		callStates.toggleSchedule.isLoading = false;
	},
	async toggleDeviceSchedule(name: string) {
    if (constrollerState.isScheduleOn) return;

    if (!deviceCallStates[name]) {
      deviceCallStates[name] = {};
    }
		deviceCallStates[name].isLoading = true;
		const result = await ControllerApi.API_toggleDeviceSchedule(name);
    devicesStatusStore.updateDeviceState(name, result.newState);
		deviceCallStates[name].isLoading = false;
	},
	async checkHardwareUpdate() {
		try {
			callStates.checkHardwareUpdate.isLoading = true;
			const updateResponse = await ControllerApi.API_getHardwareToggleUpdate();
			constrollerState.isOn = updateResponse?.status === 'success' || false;
			constrollerState.isScheduleOn = updateResponse?.data?.isScheduleOn || false;
			if (updateResponse?.data?.devices?.length) {
				devicesStatusStore.updateAllDevicesStatus(updateResponse.data.devices);
			}
		} catch {
			console.error('Failed to ping controller');
		} finally {
			callStates.checkHardwareUpdate.isLoading = false;
		}
	},
	async restartController() {
		constrollerState.isRestarting = true;
		await ControllerApi.API_restartController();

		for (;;) {
			await sleep(1000);
			try {
				const pingResponse = await ControllerApi.API_pingController();

				if (pingResponse?.ok) {
					constrollerState.isRestarting = false;
					break;
				}
			} catch {
				// ignore
			}
		}
	}
};

export default controllerStore;

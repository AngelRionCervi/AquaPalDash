import { BOX_CALL_TYPES, DASH_CALL_TYPES } from '$lib/wsGlobal/callTypes';
import ControllerApi from '$lib/api/controllerApi';
import devicesStatusStore from './deviceStatusStore.svelte';
import { CHECK_CONNECTION_INTERVAL } from '$lib/constants';
import { sleep } from '$lib/helpers/utils';
import authStore from './authStore.svelte';
import { sendWSMessage } from '$lib/wsClient/WSClientHandler';

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
		| 'toggleDevice'
		| 'deviceCallStates'
		| 'loadMockData'
		| 'handleRestarted'
		| 'resultToggleDevice'
		| 'errorToggleDevice'
		| 'resultToggleSchedule'
    | 'setIsOn'
    | 'handleRestarting'
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
	restartController: () => void;
	handleRestarted: () => void;
	checkUpdateWithInterval: () => void;
	clearCheckUpdateWithInterval: () => void;
	checkHardwareUpdate: () => Promise<void>;
	toggleSchedule: () => void;
	resultToggleSchedule: (state: boolean) => void;
	toggleDevice: (id: string) => void;
	resultToggleDevice: ({ id, state }: { id: string; state: boolean }) => void;
	errorToggleDevice: (id: string) => void;
	loadMockData: () => void;
  setIsOn: (isOn: boolean) => void;
  handleRestarting: () => void;
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
	loadMockData() {
		constrollerState.isOn = true;
		constrollerState.isScheduleOn = true;
	},
	toggleSchedule() {
		if (authStore.isDemoMode) {
			constrollerState.isScheduleOn = !constrollerState.isScheduleOn;
			return;
		}
		callStates.toggleSchedule.isLoading = true;
		sendWSMessage({ type: DASH_CALL_TYPES.dash_toggleScheduleType });
	},
	resultToggleSchedule(state: boolean) {
		constrollerState.isScheduleOn = state;
		callStates.toggleSchedule.isLoading = false;
	},
  setIsOn(isOn: boolean) {
    constrollerState.isOn = isOn;
  },
	toggleDevice(id: string) {
		console.log('onstrollerState.isScheduleOn', constrollerState.isScheduleOn);
		if (constrollerState.isScheduleOn) return;

		if (!deviceCallStates[id]) {
			deviceCallStates[id] = {};
		}

		if (authStore.isDemoMode) {
			devicesStatusStore.updateDeviceState(id, !devicesStatusStore.getDeviceStatus(id)?.isOn);
			return;
		}

		deviceCallStates[id].isLoading = true;
		sendWSMessage({ type: DASH_CALL_TYPES.dash_toggleDeviceType, data: id });
	},
	resultToggleDevice({ id, state }) {
		devicesStatusStore.updateDeviceState(id, state);
		deviceCallStates[id].isLoading = false;
	},
	errorToggleDevice(id: string) {
		console.log('errorToggleDevice', id);
		if (deviceCallStates[id]) {
			deviceCallStates[id].isLoading = false;
		}
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
  handleRestarting() {
    constrollerState.isRestarting = true;
  },
	restartController() {
		if (authStore.isDemoMode) return;
		
		//await ControllerApi.API_restartController();
		sendWSMessage({ type: DASH_CALL_TYPES.dash_restartType });

		// for (;;) {
		// 	await sleep(1000);
		// 	try {
		// 		const pingResponse = await ControllerApi.API_pingController();

		// 		if (pingResponse?.ok) {
		// 			constrollerState.isRestarting = false;
		// 			break;
		// 		}
		// 	} catch {
		// 		// ignore
		// 	}
		// }
	},
	handleRestarted() {
    console.log('controller done restating !!!!!!!!!!')
		constrollerState.isRestarting = false;
	}
};

export default controllerStore;

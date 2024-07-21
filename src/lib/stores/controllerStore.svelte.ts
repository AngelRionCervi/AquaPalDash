import ControllerApi from '$lib/api/controllerApi';
import devicesStatusStore from './deviceStatusStore.svelte';
import { CHECK_CONNECTION_INTERVAL } from '$lib/constants';
import { sleep } from '$lib/helpers/utils';
import { dev } from '$app/environment';

interface ControllerState {
	isRestarting: boolean;
	isOn: boolean;
	isScheduleOn: boolean;
	checkUpdateWithInterval: number;
}

interface ControllerStore {
	isRestarting: ControllerState['isRestarting'];
	isOn: ControllerState['isOn'];
	isScheduleOn: ControllerState['isScheduleOn'];
	restartController: () => Promise<void>;
	checkUpdateWithInterval: () => void;
	clearCheckUpdateWithInterval: () => void;
	checkHardwareUpdate: () => Promise<void>;
}

const defaultControllerStoreValue: ControllerState = {
	isRestarting: false,
	isOn: false,
	isScheduleOn: false,
	checkUpdateWithInterval: 0
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
	checkUpdateWithInterval() {
		constrollerState.checkUpdateWithInterval = setInterval(() => {
			controllerStore.checkHardwareUpdate();
		}, CHECK_CONNECTION_INTERVAL);
	},
	clearCheckUpdateWithInterval() {
		clearInterval(constrollerState.checkUpdateWithInterval);
		constrollerState.checkUpdateWithInterval = 0;
	},
	async checkHardwareUpdate() {
		try {
			const updateResponse = await ControllerApi.API_getHardwareToggleUpdate();
			constrollerState.isOn = updateResponse?.status === 'success' || false;
			constrollerState.isScheduleOn = updateResponse?.data?.isScheduleOn || false;
			if (updateResponse?.data?.devices?.length) {
				devicesStatusStore.updateDevicesStatus(updateResponse.data.devices);
			}
			console.log('updateResponse', updateResponse);
		} catch {
			console.error('Failed to ping controller');
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

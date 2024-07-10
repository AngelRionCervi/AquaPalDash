import ControllerApi from '$lib/api/controllerApi';
import { sleep } from '$lib/helpers/utils';

interface ControllerState {
	isRestarting: boolean;
	isOn: boolean;
}

interface ControllerStore {
	isRestarting: ControllerState['isRestarting'];
	isOn: ControllerState['isOn'];
	restartController: () => Promise<void>;
}

const defaultControllerStoreValue: ControllerState = {
	isRestarting: false,
	isOn: false
};

const constrollerState = $state<ControllerState>(defaultControllerStoreValue);

const controllerStore: ControllerStore = {
	get isRestarting() {
		return constrollerState.isRestarting;
	},
	get isOn() {
		return constrollerState.isOn;
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

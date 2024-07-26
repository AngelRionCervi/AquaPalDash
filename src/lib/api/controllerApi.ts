import { API_ROUTE } from '$lib/constants';

async function API_restartController() {
	try {
		const response = await fetch(`${API_ROUTE}/restart`);
		if (!response.ok) {
			throw new Error(`Failed to restart controller code ${response.status}`);
		}
	} catch (error) {
		console.error('An error occurred while restarting the controller:', error);
	}
}

async function API_pingController() {
	try {
		const pingResponse = await fetch(`${API_ROUTE}/ping`);

		if (!pingResponse.ok) {
			throw new Error(`Failed to ping controller code ${pingResponse.status}`);
		}

		return pingResponse;
	} catch (error) {
		console.error("Couldn't ping controller", error);
	}
}

async function API_getHardwareToggleUpdate() {
	try {
		const response = await fetch(`${API_ROUTE}/gethardwaretoggleupdate`);
		if (!response.ok) {
			throw new Error(`Failed to get hardware toggle updates code ${response.status}`);
		}

		const jsonResult = await response.json();
		if (jsonResult.status === 'error') {
			throw new Error(jsonResult.message);
		}

		return jsonResult;
	} catch (error) {
		console.error('An error occurred while getting hardware toggle updates:', error);
	}
}

async function API_toggleSchedule() {
	try {
		const response = await fetch(`${API_ROUTE}/toggleschedule`);
		if (!response.ok) {
			throw new Error(`Failed to toggle schedule code ${response.status}`);
		}

		const jsonResult = await response.json();
		if (jsonResult.status === 'error') {
			throw new Error(jsonResult.message);
		}

		return jsonResult;
	} catch (error) {
		console.error('An error occurred while toggling controller schedule:', error);
	}
}

async function API_toggleDeviceSchedule(id: string) {
	try {
		const response = await fetch(`${API_ROUTE}/toggledevice?id=${id}`);
		if (!response.ok) {
			throw new Error(`Failed to toggle device ${id}, code ${response.status}`);
		}

		const jsonResult = await response.json();
		if (jsonResult.status === 'error') {
			throw new Error(jsonResult.message);
		}

		return jsonResult;
	} catch (error) {
		console.error(`An error occurred while toggling ${id} schedule:`, error);
	}
}

const controllerApi = {
	API_restartController,
	API_pingController,
	API_getHardwareToggleUpdate,
	API_toggleSchedule,
	API_toggleDeviceSchedule
};

export default controllerApi;

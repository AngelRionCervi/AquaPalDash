import { API_ROUTE } from '$lib/constants';
import { sleep } from '$lib/helpers/utils';

async function restartController(): Promise<void> {
	try {
		const response = await fetch(`${API_ROUTE}/restart`);

		for (;;) {
			await sleep(1000);
			try {
				const pingResponse = await fetch(`${API_ROUTE}/ping`);

				if (pingResponse.ok) {
					console.log(pingResponse);
					break;
				}
			} catch {
				// ignore
			}
		}

		if (!response.ok) {
			console.error('Failed to restart controller');
		}
	} catch (error) {
		console.error('An error occurred while restarting the controller:', error);
	}
}

async function API_restartController() {
	try {
		const response = await fetch(`${API_ROUTE}/restart`);
		if (!response.ok) {
			throw new Error('Failed to restart controller');
		}
	} catch (error) {
		console.error('An error occurred while restarting the controller:', error);
	}
}

async function API_pingController() {
	try {
		const pingResponse = await fetch(`${API_ROUTE}/ping`);

    if (!pingResponse.ok) {
      throw new Error('Failed to ping controller');
    }

    return pingResponse;
	} catch (error) {
		console.error("Couldn't ping controller", error);
	}
}

const controllerApi = {
	API_restartController,
  API_pingController
};

export default controllerApi;

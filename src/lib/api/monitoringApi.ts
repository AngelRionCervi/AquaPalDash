import authStore from '$lib/stores/authStore.svelte';

async function API_getLastMonitoringData() {
	try {
		const response = await fetch(`${authStore.fullApiRoute}/last`);
		if (!response.ok) {
			throw new Error(`Failed to get monitoring data code ${response.status}`);
		}

		const jsonResult = await response.json();
		if (jsonResult.status === 'error') {
			throw new Error(jsonResult.message);
		}

		console.log('jsonResult last', jsonResult);

		return jsonResult.data;
	} catch (error) {
		console.error('An error occurred while getting monitoring data:', error);
	}
}

async function API_getHistoricalMonitoringData(pastDays: string) {
	try {
		const response = await fetch(`${authStore.fullApiRoute}/historical?r=${pastDays}`);
		if (!response.ok) {
			throw new Error(`Failed to get historical monitoring data code ${response.status}`);
		}

		const textResult = await response.text();

		if (!textResult.length) {
			throw new Error('No historical data');
		}

		const parseModif = `[${textResult.split('\n').join(',').slice(0, -1)}]`;
		const jsonResult = JSON.parse(parseModif);

		return jsonResult;
	} catch (error) {
		console.error('An error occurred while getting historical monitoring data:', error);
	}
}

const monitoringApi = {
	API_getLastMonitoringData,
	API_getHistoricalMonitoringData
};

export default monitoringApi;

import { API_ROUTE } from '$lib/constants';

async function login(pass: string) {
	const body = JSON.stringify({ pass });

	try {
		const result = await fetch(`${API_ROUTE}/login`, { method: 'post', body });
		const jsonResult = await result.json() as ApiResponse;
		console.log('result login', jsonResult);
		return jsonResult;
	} catch (err) {
		console.error(err);
	}
}

async function fetchConfig() {
	try {
		const result = await fetch(`${API_ROUTE}/getconfig`);
		const jsonResult = await result.json();

    if (jsonResult.status === 'error') {
      throw new Error(jsonResult.message);
    }

		return jsonResult as ApiResponse;
	} catch (err) {
		console.error(err);
	}

	return null;
}

async function uploadConfig(config: Config) {
	try {
		const result = await fetch(`${API_ROUTE}/updateconfig`, {
			method: 'post',
			body: JSON.stringify(config)
		});
		const jsonResult = await result.json() as ApiResponse;
		return jsonResult;
	} catch (err) {
		console.error(err);
	}
}

const ConfigApi = {
	login,
	fetchConfig,
	uploadConfig
};

export default ConfigApi;

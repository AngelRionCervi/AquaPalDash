export const API_ROUTE = 'http://192.168.1.22';

async function login(pass: string) {
	const body = JSON.stringify({ pass });

	try {
		const result = await fetch(`${API_ROUTE}/login`, { method: 'post', body });
		const jsonResult = await result.json();
		console.log('result login', jsonResult);
	} catch (err) {
		console.error(err);
	}
}

async function fetchConfig() {
	try {
		const result = await fetch(`${API_ROUTE}/getconfig`);
		const jsonResult = await result.json();
		console.log('result get config', jsonResult);

		return jsonResult.data as Config;
	} catch (err) {
		console.error(err);
	}

  return null;
}

const ConfigApi = {
	login,
	fetchConfig
};

export default ConfigApi;

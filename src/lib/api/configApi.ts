import authStore from '$lib/stores/authStore.svelte';

async function login(pass: string) {
  if (authStore.isDemoMode) return;

	const body = JSON.stringify({ pass });

	try {
		const result = await fetch(`${authStore.fullApiRoute}/login`, { method: 'post', body });
		const jsonResult = (await result.json()) as ApiResponse;
		console.log('result login', jsonResult);
		return jsonResult;
	} catch (err) {
		console.error(err);
	}
}

async function fetchConfig() {
  if (authStore.isDemoMode) return;

	try {
    console.log('authStore.fullApiRoute', authStore.fullApiRoute)
		const result = await fetch(`${authStore.fullApiRoute}/getconfig`);
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
  if (authStore.isDemoMode) return;
  
	try {
		const result = await fetch(`${authStore.fullApiRoute}/updateconfig`, {
			method: 'post',
			body: JSON.stringify(config)
		});
		const jsonResult = (await result.json()) as ApiResponse;
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

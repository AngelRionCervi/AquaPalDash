import authStore from '$lib/stores/authStore.svelte';

async function login(pass: string) {
	console.log('authStore.isDemoMode', authStore.isDemoMode);
	if (authStore.isDemoMode) return;

	const body = JSON.stringify({ pass });

	try {
		const result = await fetch('/login', { method: 'post', body });
		const jsonResult = (await result.json()) as ApiResponse;
		console.log('result login', jsonResult);
		return jsonResult;
	} catch (err) {
		console.error(err);
		return err;
	}
}

const ConfigApi = {
	login
};

export default ConfigApi;

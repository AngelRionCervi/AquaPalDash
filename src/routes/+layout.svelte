<script lang="ts">
	import '../resets.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import menuRoutes from '$lib/data/navMenu';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Header from '$lib/components/Header/Header.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import configStore from '$lib/stores/configStore.svelte';
	import controllerStore from '$lib/stores/controllerStore.svelte';
	import InitLoadingBackdrop from '$lib/components/Backdrop/InitLoadingBackdrop.svelte';
	import monitoringStore from '$lib/stores/monitoringStore.svelte';
	import authStore from '$lib/stores/authStore.svelte';
	import windowStore from '$lib/stores/windowStore.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import deviceStatusStore from '$lib/stores/deviceStatusStore.svelte';
	import { WS_SERVER_PORT } from '$lib/constants';

	const { children, data } = $props();
	const { toggle } = modalStore;

	let mainLoading = $state(false);
	let needsLogin = $state(false);

	function getCurrentPageTitle() {
		return menuRoutes.find(({ route }) => route === $page.url.pathname)?.label || 'Home';
	}

	function onNewLogin(port: string, rememberMe: boolean, demoMode: boolean) {
		authStore.setPort(port);
		authStore.setDemoMode(demoMode);

		if (rememberMe) {
			authStore.saveSession({ port, demoMode });
		}

		needsLogin = false;
		startUp();
		toggle();
	}

	async function startUp() {
		mainLoading = true;

		windowStore.init();

		if (authStore.isDemoMode) {
			configStore.loadMockConfig();
			deviceStatusStore.loadDeviceStatusMock();
			controllerStore.loadMockData();
			mainLoading = false;
			needsLogin = false;
			return;
		}

		await configStore.fetchAndSetConfig();

		if (!configStore.config) {
			mainLoading = false;
			return;
		}

		await controllerStore.checkHardwareUpdate();

		const { enableMonitoring, prefetchHistorical } = configStore.config?.settings || {};
		if (enableMonitoring && prefetchHistorical) {
			await monitoringStore.updateLast();
			await monitoringStore.fetchHistoricals();
			monitoringStore.updateLastWithInterval();
		}

		controllerStore.checkUpdateWithInterval();

		mainLoading = false;
	}

	onMount(() => {
		// test

		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		console.log('window', window.location);
		const ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);
		ws.addEventListener('open', (event) => {
			console.log('[websocket] connection open', event);
			const initPayload = JSON.stringify({ source: 'dash', type: 'handshake' });
			ws.send(initPayload);
		});
		ws.addEventListener('close', (event) => {
			console.log('[websocket] connection closed', event);
		});
		ws.addEventListener('message', (event) => {
			console.log('[websocket] message received', event);
		});

		if (data.isProd) {
			authStore.init();
			if (authStore.port) {
				startUp();
			} else {
				needsLogin = true;
				toggle('Login', 'login', {
					onLogin: (password: string, rememberMe: boolean, demoMode: boolean) =>
						onNewLogin(password, rememberMe, demoMode)
				});
			}
		} else {
			startUp();
		}
	});
</script>

<div class="main-layout">
	{#if needsLogin}
		<Modal />
	{:else if mainLoading}
		<InitLoadingBackdrop />
	{:else if configStore.config}
		<Modal />
		<Header />
		<span class="page-title">{getCurrentPageTitle()}</span>
		{@render children()}
		<Footer />
	{:else}
		<span>Could not fetch config...</span>
	{/if}
</div>

<style lang="scss">
	@import '$lib/variables.scss';

	.main-layout {
		width: calc(100vw - 128px);
		height: calc(100vh - 64px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 32px 64px;

		@media screen and (max-width: $mobile-bp) {
			margin: 8px;
			width: calc(100vw - 16px);
			min-height: calc(100vh - 16px);
			height: auto;
		}
	}

	.page-title {
		margin: 42px 64px;
		font-size: var(--font-L);
		font-weight: bold;

		@media screen and (max-width: $mobile-bp) {
			margin: 32px;
		}

		@media screen and (max-width: $small-mobile-bp) {
			margin: 24px;
		}
	}
</style>

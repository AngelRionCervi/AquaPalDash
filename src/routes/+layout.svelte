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

	const { children } = $props();

	let mainLoading = $state(true);

	function getCurrentPageTitle() {
		return menuRoutes.find(({ route }) => route === $page.url.pathname)?.label || 'Home';
	}

	onMount(async () => {
		await configStore.fetchAndSetConfig();
    await controllerStore.checkHardwareUpdate();

    const { enableMonitoring, prefetchHistorical } = configStore.config?.settings || {};
		if (enableMonitoring && prefetchHistorical) {
			await monitoringStore.updateLast();
			await monitoringStore.fetchHistoricals();
			monitoringStore.updateLastWithInterval();
		}
    
		controllerStore.checkUpdateWithInterval();

		mainLoading = false;
	});
</script>

<div class="main-layout">
	{#if mainLoading}
		<InitLoadingBackdrop />
	{:else}
		<Modal />
		<Header />
		<span class="page-title">{getCurrentPageTitle()}</span>
		{@render children()}
		<Footer />
	{/if}
</div>

<style lang="scss">
	@import '$lib/variables.scss';

	.main-layout {
		width: calc(100vw - 128px);
		height: calc(100vh - 128px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 64px;
	}

	.page-title {
		margin: 42px 64px;
		font-size: var(--font-L);
		font-weight: bold;
	}
</style>

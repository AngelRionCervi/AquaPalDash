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

	const { children, data } = $props();

	let mainLoading = $state(true);

	function getCurrentPageTitle() {
		return menuRoutes.find(({ route }) => route === $page.url.pathname)?.label || 'Home';
	}

  function promptPass() {
    const pass = prompt('Enter password');
    if (pass) {
      authStore.setPass(pass);
    }
  }

	onMount(async () => {
    if (data.isProd) {
      promptPass();
    }
    windowStore.init();
		await configStore.fetchAndSetConfig();

    if (!configStore.config) {
      mainLoading = false;
      return;
    };

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

<script lang="ts">
	import { page } from '$app/stores';
	import menuRoutes from '$lib/data/navMenu';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Header from '$lib/components/Header/Header.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import { onMount } from 'svelte';
	import configStore from '$lib/stores/configStore.svelte';
  import controllerStore from '$lib/stores/controllerStore.svelte';

	const { children } = $props();

	function getCurrentPageTitle() {
		return menuRoutes.find(({ route }) => route === $page.url.pathname)?.label || 'Home';
	}

	onMount(() => {
		configStore.fetchAndSetConfig();
    controllerStore.checkHardwareUpdate();
		controllerStore.checkUpdateWithInterval();
	});
</script>

<div class="main-layout">
	<Modal />
	<Header />
	<span class="page-title">{getCurrentPageTitle()}</span>
	{@render children()}
	<Footer />
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

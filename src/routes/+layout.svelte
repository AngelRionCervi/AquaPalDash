<script lang="ts">
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Header from '$lib/components/Header/Header.svelte';

	const { children } = $props();
</script>

<div class="main-layout">
	<Header />
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
</style>

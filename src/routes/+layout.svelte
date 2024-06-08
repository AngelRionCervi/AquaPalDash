<script lang="ts">
	import Footer from '$lib/components/Footer/Footer.svelte';
	import Header from '$lib/components/Header/Header.svelte';

	const { children } = $props();
</script>

<div class="main-layout">
	<Header />
	hello from layout
	{@render children()}
	<Footer />
</div>

<style lang="scss">
	@import '$lib/variables.scss';

	.main-layout {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: var(--primary);
	}
</style>

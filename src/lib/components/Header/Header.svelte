<script lang="ts">
	import DesktopNavMenu from '$lib/components/Navigation/DesktopNavMenu.svelte';
	import HeaderTop from './HeaderTop.svelte';
</script>

<div class="header">
	<div class="top-header">
		<HeaderTop />
	</div>
	<div class="bottom-header">
		<DesktopNavMenu />
	</div>
</div>

<style lang="scss">
	.header {
		width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
	}
</style>

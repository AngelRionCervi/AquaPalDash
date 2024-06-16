<script lang="ts">
	import DeviceCard from '$lib/components/Device/DeviceCard.svelte';
</script>

<div class="devices-main-container">
	<div class="devices-cards">
		<DeviceCard />
	</div>
</div>

<style lang="scss">
	.devices-main-container {
    margin: 0 64px;
    height: 100%;
		display: flex;
    flex-direction: column;
	}
</style>

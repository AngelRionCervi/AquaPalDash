<script lang="ts">
	import DeviceCard from '$lib/components/Device/DeviceCard.svelte';
	import configStore from '$lib/stores/configStore.svelte';
</script>

<div class="devices-main-container">
	<div class="devices-cards">
		{#if configStore.config}
			{#each configStore.config.devices as device}
				<DeviceCard {device} />
			{/each}
		{:else}
			<span>Could not fetch config</span>
		{/if}
	</div>
</div>

<style lang="scss">
	.devices-main-container {
		margin: 0 64px;
		height: 100%;
		display: flex;
	}

  .devices-cards {
    display: flex;
    gap: 32px;
  }
</style>

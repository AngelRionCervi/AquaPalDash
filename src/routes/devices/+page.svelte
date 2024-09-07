<script lang="ts">
  import DeviceCard from '$lib/components/Device/DeviceCard.svelte';
  import configStore from '$lib/stores/configStore.svelte';

  let devicesInOrder = $state(configStore.config?.devices);

  $effect(() => {
    devicesInOrder = configStore.config?.devices.sort((a, b) => a.button - b.button);
  });
</script>

<div class="devices-main-container">
  <div class="devices-cards">
    {#if devicesInOrder?.length}
      {#each devicesInOrder as device (device.id)}
        <DeviceCard {device} />
      {/each}
    {:else}
      <span>Could not fetch config</span>
    {/if}
  </div>
</div>

<style lang="scss">
  @import '$lib/variables.scss';

  .devices-main-container {
    margin: 0 64px 32px 64px;
    height: 100%;
    display: flex;
	margin: 0 0 32px 0;
	overflow: auto;

    @media screen and (max-width: $mobile-bp) {
      margin: 0 0 32px 0;
    }
  }

  .devices-cards {
    display: flex;
    gap: 32px;
	padding: 32px 0;
  }
</style>

<script lang="ts">
  import ScheduleButton from '$lib/components/Buttons/ScheduleButton.svelte';
  import DeviceButton from '$lib/components/Buttons/DeviceButton.svelte';
  import LockIcon from '$lib/icons/lock.svg?component';
  import UnlockIcon from '$lib/icons/unlock.svg?component';
  import configStore from '$lib/stores/configStore.svelte';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import deviceStatusStore from '$lib/stores/deviceStatusStore.svelte';
  import { MOBILE_BP } from '$lib/constants';
  import windowStore from '$lib/stores/windowStore.svelte';

  let devicesInOrder = $state(configStore.config?.devices || []);

  const lockIconMap = {
    lock: LockIcon,
    unlock: UnlockIcon
  };

  function onScheduleButtonClick() {
    controllerStore.toggleSchedule();
  }

  function onDeviceButtonClick(id: string) {
    if (controllerStore.isScheduleOn) return;
    controllerStore.toggleDevice(id);
  }

  $effect(() => {
    devicesInOrder = configStore.config?.devices.sort((a, b) => a.button - b.button) || [];
  });

  const LockIconComponent = $derived(lockIconMap[controllerStore.isScheduleOn ? 'lock' : 'unlock']);
</script>

<div class="home-main-container">
  <div class="home-inner">
    <div class="schedule-button-container">
      <ScheduleButton
        onClick={onScheduleButtonClick}
        scheduleState={controllerStore.isScheduleOn}
        isLoading={!!controllerStore.callStates.toggleSchedule.isLoading}
      />
    </div>
    <div class="lock-container">
      <LockIconComponent width={windowStore.width < MOBILE_BP ? 48 : 96} height={windowStore.width < MOBILE_BP ? 48 : 96} fill="var(--secondary)" />
    </div>
    <div class="device-buttons-container">
      {#if configStore.config?.devices}
        {#each devicesInOrder as { id, name } (id)}
          <DeviceButton
            onClick={() => onDeviceButtonClick(id)}
            {name}
            disabled={controllerStore.isScheduleOn || !controllerStore.isOn || !deviceStatusStore.getDeviceStatus(id)?.isConnected}
            isLoading={!!controllerStore.deviceCallStates[id]?.isLoading}
            state={!!deviceStatusStore.getDeviceStatus(id)?.isOn}
          />
        {/each}
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/variables.scss';

  .home-main-container {
    display: flex;
    height: 100%;
    margin: 0 64px;
    justify-content: center;

    @media screen and (max-width: variables.$mobile-bp) {
      margin: 0 32px 32px 32px;
    }
  }

  .home-inner {
    display: flex;
    gap: 8vw;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: variables.$mobile-bp) {
      flex-direction: column;
      gap: 32px;
    }
  }

  .device-buttons-container {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
    margin: 32px 0;

    @media screen and (max-width: variables.$mobile-bp) {
      margin: 0;
    }
  }

  .schedule-button-container {
    margin: 32px 0;

    @media screen and (max-width: variables.$mobile-bp) {
      margin: 0;
    }
  }
</style>

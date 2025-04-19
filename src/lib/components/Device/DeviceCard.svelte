<script lang="ts">
  import SmallButton from '$lib/components/Buttons/SmallButton.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import devicesStatusStore from '$lib/stores/deviceStatusStore.svelte';
  import { getScheduleLabel } from '$lib/helpers/utils';
  import GearIcon from '$lib/icons/gear.svg?component';
  import UnsyncIcon from '$lib/icons/unsync.svg?component';
  import configStore from '$lib/stores/configStore.svelte';
  import type { Device } from '$lib/types';
  import controllerStore from '$lib/stores/controllerStore.svelte';

  interface Props {
    device: Device;
  }

  const { device }: Props = $props();
  const deviceStatus = $derived(devicesStatusStore.getDeviceStatus(device.id));
  const deviceDisabled = $derived(device.isUnsaved || device.toBeRemoved);
  const scheduleLabels = $derived(getScheduleLabel(device.schedule, configStore.config?.settings?.timeFormat));
  const { toggle } = modalStore;

  function onScheduleEdit() {
    toggle('scheduleSetting', { id: device.id }, device.name);
  }

  function onButtonSlotEdit() {
    toggle('buttonSlotSetting', { id: device.id }, device.name);
  }

  function onModifyName() {
    toggle('modifyDevice', { id: device.id }, device.name);
  }

  function onRevertDevice() {
    configStore.revertDevice(device.id);
  }

  function getPillStatusOn() {
    if (!deviceStatus?.isConnected) return '?';
    return deviceStatus?.isOn ? 'on' : 'off';
  }

  function getPillStatusConnected() {
    if (deviceStatus?.isOn === null) return '?';
    return deviceStatus?.isOn ? 'online' : 'offline';
  }
</script>

<div class="card-outer-container">
  <div class="card-container" class:card-device-unsaved={deviceDisabled} class:card-device-modified={device.isModified}>
    <div class="device-name-container">
      <div class="device-modified">
        <div class="unsync-icon-container">
          {#if device.isModified && !device.isUnsaved && !device.toBeRemoved}
            <button
              onclick={onRevertDevice}
              class="revert-device-button"
              title="Revert device modifications"
              aria-label="Revert device modifications"
            >
              <UnsyncIcon fill="var(--warning)" />
            </button>
          {/if}
        </div>
      </div>
      <div class="device-name">
        <span>{device.name}</span>
        <button onclick={onModifyName} class="device-edit-button" aria-label="Edit device"><GearIcon width={16} height={16} /></button>
      </div>
    </div>
    <div class="separator"></div>
    <div class="device-status">
      <span class="setting-title">Status:</span>
      <div class="status-pills">
        <span class="pill is-{deviceStatus?.isConnected ? 'on' : 'off'}">{getPillStatusConnected()}</span>
        <span class="pill is-{(deviceStatus?.isConnected && deviceStatus?.isOn) ? 'on' : 'off'}">{getPillStatusOn()}</span>
      </div>
    </div>
    <div class="semi-separator"></div>
    <div class="device-controls">
      <div class="editable-row-slot">
        <div class="row-values-slot">
          <span class="setting-title">Button slot:</span>
          <div class="current-value-slot"><span>{device.button + 1}</span></div>
        </div>
        <SmallButton onclick={onButtonSlotEdit} disabled={deviceDisabled} label="Edit" />
      </div>
      <div class="semi-separator"></div>
      <div class="editable-row-schedule">
        <span class="setting-title">Schedule:</span>
        <div class="current-value-schedule">
          {#if Array.isArray(scheduleLabels)}
            <span><p>On between <b>{scheduleLabels[0]}</b> and <b>{scheduleLabels[1]}</b>.</p></span>
          {:else}
            <span>{scheduleLabels}.</span>
          {/if}
        </div>
        <SmallButton onclick={onScheduleEdit} disabled={deviceDisabled} label="Edit" />
      </div>
    </div>
  </div>
  {#if device.toBeRemoved || device.isUnsaved}
    <button
      onclick={onRevertDevice}
      class="revert-device-full-button"
      class:disabled={controllerStore.isRestarting}
      title="Revert device modifications"
      aria-label="Revert device modifications"
      disabled={controllerStore.isRestarting}
    >
      <UnsyncIcon fill="var(--warning)" />
    </button>
  {/if}
</div>

<style lang="scss">
  .card-outer-container {
    position: relative;
  }

  .revert-device-full-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    color: var(--warning);
    border-radius: var(--radius-XL);
    background-color: var(--warning-lighter);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border: 2px solid transparent;
    visibility: visible;

    &:not(.disabled):hover {
      border: 2px solid var(--warning);
    }

    &.disabled {
      visibility: hidden;
    }
  }

  .card-container {
    border: 1px solid var(--secondary);
    background-color: var(--primary);
    border-radius: var(--radius-XL);
    padding: 24px;
    width: 250px;
    height: fit-content;
    box-shadow: 0px 4px 4px -2px var(--secondary-lighter);
  }

  .card-device-unsaved {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .card-device-modified {
    border: 1px solid var(--warning);
  }

  .device-name-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .device-name {
    font-size: var(--font-L);
    display: flex;
    gap: 8px;
    margin-left: 25px;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
  }

  .separator {
    width: calc(100% + 48px);
    height: 1px;
    background-color: var(--secondary);
    margin: 20px 0 20px -24px;
  }

  .semi-separator {
    width: calc(100% + 0px);
    height: 1px;
    background-color: var(--secondary);
    margin: 20px 0 20px 0px;
  }

  .device-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-pills {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .setting-title {
    font-size: var(--font-M);
  }

  .pill {
    border-radius: 15px;
    padding: 1px 6px 2px 6px;
    font-size: var(--font-S);
    line-height: 14px;
    margin-bottom: 6px;
    color: var(--secondary-text);
    width: fit-content;

    &.is-on {
      background-color: var(--primary-success);
    }

    &.is-off {
      background-color: var(--primary-error);
    }
  }

  .editable-row-slot {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row-values-slot {
    display: flex;
    justify-content: space-between;
  }

  .current-value-slot {
    font-size: var(--font-S);
    border-radius: 999px;
    background-color: var(--secondary);
    color: var(--secondary-text);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .editable-row-schedule {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .current-value-schedule {
    font-size: var(--font-S);
    font-weight: bold;
  }

  .device-edit-button {
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    border-radius: var(--radius-S);
    height: fit-content;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--primary-darker);
    }
  }

  .revert-device-button {
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    border-radius: var(--radius-S);
    height: fit-content;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    color: var(--warning);

    &:hover {
      background-color: var(--warning-lighter);
    }
  }

  .device-modified {
    position: absolute;
    left: -12px;
    top: -12px;
  }

  .unsync-icon-container {
    width: 20px;
    height: 20px;
  }
</style>

<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import ErrorField from './ErrorField.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import {
    AQUA_PAL_NAME,
    BLUETOOTH_CHARACTERISTICS_UUID_MAP,
    BT_CONFIG_DONE_CHARACTERISTIC_NAME,
    BT_SSID_CHARACTERISTIC_NAME,
    BT_WIFIPASS_CHARACTERISTIC_NAME
  } from '$lib/constants';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import Loader from '$lib/components/Loaders/Loader.svelte';

  let ssid = $state<string | null>(null);
  let wifiPass = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);
  let configDone = $state<boolean>(false);

  async function onValidate() {
    if (!ssid) {
      errorMessage = 'Please enter a network SSID';
    } else {
      errorMessage = null;
    }

    const newCharacValues = {
      [BT_SSID_CHARACTERISTIC_NAME]: ssid || '',
      [BT_WIFIPASS_CHARACTERISTIC_NAME]: wifiPass || '',
      [BT_CONFIG_DONE_CHARACTERISTIC_NAME]: 'true'
    } as Record<keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, string>;

    try {
      const result = await bluetoothStore.writeToMultipleCharacteristics(newCharacValues);
      if (result.every((r) => !!r) && result.length === Object.keys(newCharacValues).length) {
        controllerStore.restartController();
        configDone = true;
        return;
      }
      throw new Error();
    } catch (error) {
      errorMessage = 'Could not save the network informations. Please try again.';
      console.error(`${errorMessage}: ${error}`);
    }
  }

  $effect(() => {
    if (configDone && !controllerStore.isRestarting) {
      //modalStore.toggle();
    }
  });
</script>

<div class="wifi-setup-container">
  {#if configDone}
    <div class="loading-container">
      <p>Restarting {AQUA_PAL_NAME}...</p>
      <Loader size="medium" theme="dark" />
    </div>
  {:else}
    <div class="modify-row">
      <label for="network_ssid">Network SSID:</label>
      <input type="text" id="network_ssid" bind:value={ssid} />
    </div>
    <div class="modify-row">
      <label for="network_pass">Network password (leave empty if the network is public):</label>
      <input type="password" id="network_pass" bind:value={wifiPass} />
    </div>
    <div class="bottom">
      <ErrorField messages={errorMessage} />
      <PrimaryButton label="Save" disabled={!ssid || controllerStore.isRestarting} onclick={onValidate} />
    </div>
  {/if}
</div>

<style lang="scss">
  .wifi-setup-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
    align-items: center;
  }

  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .modify-row {
    width: 60%;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: space-between;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }
</style>

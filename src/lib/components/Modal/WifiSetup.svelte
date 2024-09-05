<script lang="ts">
  import { onMount } from 'svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import ErrorField from './ErrorField.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import {
    AQUA_PAL_NAME,
    BLUETOOTH_CHARACTERISTICS_UUID_MAP,
    BT_CONFIG_DONE_CHARACTERISTIC_NAME,
    BT_SSID_CHARACTERISTIC_NAME,
    BT_WIFIPASS_CHARACTERISTIC_NAME,
    NO_WIFI_NETWORKS_FOUND_TIMEOUT
  } from '$lib/constants';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import Loader from '$lib/components/Loaders/Loader.svelte';
  import WifiNetworkCard from '../Inputs/WifiNetworkCard.svelte';
  import type { WifiNetwork } from '$lib/types';

  let ssid = $state<string | null>(null);
  let wifiPass = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);
  let configDone = $state<boolean>(false);
  let noNetworksFound = $state<boolean>(false);

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

  function onWifiNetworkSelect(chosenSSID: string) {
    ssid = chosenSSID;
  }

  function sortWifiList(wifiList: WifiNetwork[]) {
    return wifiList.sort((a, b) => {
      if (a.rssi > b.rssi) {
        return -1;
      }
      if (a.rssi < b.rssi) {
        return 1;
      }
      return 0;
    });
  }

  onMount(() => {
    setTimeout(() => {
      noNetworksFound = !bluetoothStore.wifiList.length;
    }, NO_WIFI_NETWORKS_FOUND_TIMEOUT);
  });
</script>

<div class="wifi-setup-container">
  {#if configDone}
    <div class="loading-container">
      <p>Restarting {AQUA_PAL_NAME}...</p>
      <Loader size="medium" theme="dark" />
    </div>
  {:else}
    <div class="network-list-row">
      {#if !bluetoothStore.wifiList.length}
        <div class="waiting-for-networks-container">
          {#if noNetworksFound}
            <p>No wifi networks found...</p>
          {/if}
          <Loader size="medium" theme="dark" />
        </div>
      {:else}
        {#each sortWifiList(bluetoothStore.wifiList) as wifiNetwork (wifiNetwork.ssid)}
          <WifiNetworkCard {wifiNetwork} isSelected={wifiNetwork.ssid === ssid} onClick={onWifiNetworkSelect} />
        {/each}
      {/if}
    </div>
    <div class="modify-row">
      <label for="network_pass">
        <span class="main-label">Network password:</span> <span class="public-indication">(leave empty if the network is public)</span>
      </label>
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

  .network-list-row {
    width: 60%;
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: space-between;
    height: 180px;
    overflow: auto;
  }

  .waiting-for-networks-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .main-label {
    font-weight: bold;
  }

  .public-indication {
    font-size: var(--font-S);
  }
</style>

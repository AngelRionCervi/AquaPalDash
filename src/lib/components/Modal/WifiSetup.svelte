<script lang="ts">
  import { onMount } from 'svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from './ErrorField.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import {
    BLUETOOTH_CHARACTERISTICS_UUID_MAP,
    BT_CONFIG_DONE_CHARACTERISTIC_NAME,
    BT_SSID_CHARACTERISTIC_NAME,
    BT_WIFIPASS_CHARACTERISTIC_NAME,
    NO_WIFI_NETWORKS_FOUND_TIMEOUT
  } from '$lib/constants';
  import Loader from '$lib/components/Loaders/Loader.svelte';
  import WifiNetworkCard from '$lib/components/Inputs/WifiNetworkCard.svelte';
  import type { WifiNetwork } from '$lib/types';
  import PasswordInput from '$lib/components/Inputs/PasswordInput.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';

  let ssid = $state<string | null>(null);
  let wifiPass = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);
  let selectedWifiDone = $state<boolean>(false);
  let noNetworksFound = $state<boolean>(false);
  let wifiNetworkFingerprint = $state<string | null>(null);
  let validateLoading = $state<boolean>(false);

  const sortedWifiList = $derived(sortWifiList(bluetoothStore.wifiList));

  const { toggle } = modalStore;

  async function onValidate() {
    if (!ssid) {
      errorMessage = 'Please enter a network SSID';
    } else {
      errorMessage = null;
    }

    bluetoothStore.isSelectedWifiTested = false;

    const newCredValues = { [BT_SSID_CHARACTERISTIC_NAME]: ssid || '', [BT_WIFIPASS_CHARACTERISTIC_NAME]: wifiPass || '' } as Record<
      keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP,
      string
    >;

    try {
      validateLoading = true;
      const newCredResult = await bluetoothStore.writeToMultipleCharacteristics(newCredValues);

      if (newCredResult.every((r) => !!r)) {
        await bluetoothStore.writeToCharacteristic(BT_CONFIG_DONE_CHARACTERISTIC_NAME, 'true');
        return;
      }

      throw new Error('Could not write all the new network credentials to the device');
    } catch (error) {
      errorMessage = 'Could not save the network informations. Please try again.';
      console.error(`${errorMessage}: ${error}`);
    } finally {
      validateLoading = false;
    }
  }

  function onWifiNetworkSelect(chosenSSID: string, fingerprint: string) {
    if (ssid === chosenSSID) {
      ssid = null;
      return;
    }
    ssid = chosenSSID;
    wifiNetworkFingerprint = fingerprint;
  }

  function sortWifiList(wifiList: WifiNetwork[]) {
    return [...wifiList].sort((a, b) => {
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
    bluetoothStore.isSelectedWifiTested = false;
    bluetoothStore.isSelectedWifiError = false;
    errorMessage = null;
    bluetoothStore.subscribeToWifiTestedCharacteristic();
    setTimeout(() => {
      noNetworksFound = !bluetoothStore.wifiList.length;
    }, NO_WIFI_NETWORKS_FOUND_TIMEOUT);
  });

  $effect(() => {
    if (bluetoothStore.isSelectedWifiError) {
      errorMessage = 'Could not connect to the selected network';
    } else {
      errorMessage = null;
    }
  });

  $effect(() => {
    if (bluetoothStore.isSelectedWifiTested && !selectedWifiDone) {
      selectedWifiDone = true;
      toggle('wifiSetupLogin', {
        backButtonHandler: () => {
          toggle('wifiSetup');
        }
      });
    }
  });
</script>

<div class="wifi-setup-container">
  <div class="networks-row">
    <span class="main-label">Available networks:</span>
    <div class="network-list-row">
      {#if !bluetoothStore.wifiList.length}
        <div class="waiting-for-networks-container">
          {#if noNetworksFound}
            <p>No wifi networks found...</p>
          {/if}
          <Loader size="medium" theme="dark" />
        </div>
      {:else}
        {#each sortedWifiList as wifiNetwork}
          <WifiNetworkCard {wifiNetwork} isSelected={wifiNetwork.fingerprint === wifiNetworkFingerprint} onSelect={onWifiNetworkSelect} />
        {/each}
      {/if}
    </div>
  </div>
  <div class="modify-row">
    <label for="network_pass">
      <span class="main-label">Network password:</span>
    </label>
    <PasswordInput placeholder="Network password" onInput={(value) => (wifiPass = value)} id="network_pass" />
  </div>
  <div class="bottom">
    <ErrorField messages={errorMessage} />
    <PrimaryButton label="Save" disabled={!ssid} isLoading={validateLoading} onclick={onValidate} />
  </div>
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
    width: 70%;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: space-between;
  }

  .networks-row {
    width: 100%;
    display: flex;
    gap: 8px;
    flex-direction: column;
    align-items: center;
  }

  .network-list-row {
    width: 70%;
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: flex-start;
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
    text-align: left;
    font-weight: bold;
    width: 70%;
  }
</style>

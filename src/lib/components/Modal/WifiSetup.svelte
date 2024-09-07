<script lang="ts">
  import { onMount } from 'svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from './ErrorField.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import {
    AQUA_PAL_NAME,
    BLUETOOTH_CHARACTERISTICS_UUID_MAP,
    BT_CONFIG_DONE_CHARACTERISTIC_NAME,
    BT_RESTART_CHARACTERISTIC_NAME,
    BT_SSID_CHARACTERISTIC_NAME,
    BT_WIFIPASS_CHARACTERISTIC_NAME,
    CONNECT_TO_PAL_AFTER_SETUP_TIMEOUT,
    NO_WIFI_NETWORKS_FOUND_TIMEOUT
  } from '$lib/constants';
  import Loader from '$lib/components/Loaders/Loader.svelte';
  import WifiNetworkCard from '$lib/components/Inputs/WifiNetworkCard.svelte';
  import type { WifiNetwork } from '$lib/types';
  import PasswordInput from '../Inputs/PasswordInput.svelte';
  import { sendWSMessage } from '$lib/wsClient/WSClientHandler';
  import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';
  import configStore from '$lib/stores/configStore.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';

  let ssid = $state<string | null>(null);
  let wifiPass = $state<string | null>(null);
  let loginPass = $state<string | null>(null);
  let errorMessage = $state<string | null>(null);
  let configDone = $state<boolean>(false);
  let noNetworksFound = $state<boolean>(false);
  let wifiNetworkFingerprint = $state<string | null>(null);
  let validateLoading = $state<boolean>(false);
  let cantConnectToPal = $state<boolean>(false);

  let handshakeInterval: ReturnType<typeof setInterval> | null = null;
  let cantConnectToPalTimeout: ReturnType<typeof setTimeout> | null = null;

  const configCheckPeriode = 3000;

  async function onConfigDone() {
    configDone = true;
    console.log('config done');
    modalStore.childProps = { ...modalStore.childProps, backButtonHandler: null };

    await bluetoothStore.writeToCharacteristic(BT_RESTART_CHARACTERISTIC_NAME, 'true');

    if (handshakeInterval) {
      clearInterval(handshakeInterval);
    }
    if (cantConnectToPalTimeout) {
      clearTimeout(cantConnectToPalTimeout);
    }

    cantConnectToPalTimeout = setTimeout(() => {
      cantConnectToPal = true;
    }, CONNECT_TO_PAL_AFTER_SETUP_TIMEOUT);

    const handshakePayload = {
      type: DASH_CALL_TYPES.dash_handShakeType,
      data: loginPass
    };

    handshakeInterval = setInterval(() => {
      sendWSMessage(handshakePayload);
    }, configCheckPeriode);
  }

  async function onValidate() {
    if (!ssid) {
      errorMessage = 'Please enter a network SSID';
    } else {
      errorMessage = null;
    }

    bluetoothStore.isSelectedWifiTested = false;

    const newCredValues = {
      [BT_SSID_CHARACTERISTIC_NAME]: ssid || '',
      [BT_WIFIPASS_CHARACTERISTIC_NAME]: wifiPass || ''
    } as Record<keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, string>;

    try {
      validateLoading = true;
      const newCredResult = await bluetoothStore.writeToMultipleCharacteristics(newCredValues);

      if (newCredResult.every((r) => !!r)) {
        await bluetoothStore.writeToCharacteristic(BT_CONFIG_DONE_CHARACTERISTIC_NAME, 'true');
        return;
      }

      throw new Error();
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
    bluetoothStore.isSelectedWifiTested = false;
    bluetoothStore.isSelectedWifiError = false;
    bluetoothStore.subscribeToWifiTestedCharacteristic();
    setTimeout(() => {
      noNetworksFound = !bluetoothStore.wifiList.length;
    }, NO_WIFI_NETWORKS_FOUND_TIMEOUT);

    return () => {
      if (handshakeInterval) {
        clearInterval(handshakeInterval);
      }
      if (cantConnectToPalTimeout) {
        clearTimeout(cantConnectToPalTimeout);
      }
      bluetoothStore.toggleWifiListInterval(false);
    };
  });

  $effect(() => {
    if (configStore.config) {
      modalStore.toggle();
    }
  });

  $effect(() => {
    if (bluetoothStore.isSelectedWifiError) {
      errorMessage = `Could not connect to the selected network.`;
    } else {
      errorMessage = null;
    }
  });

  $effect(() => {
    if (bluetoothStore.isSelectedWifiTested && !configDone) {
      configDone = true;
      onConfigDone();
    }
  });
</script>

<div class="wifi-setup-container">
  {#if configDone && bluetoothStore.isSelectedWifiTested}
    {#if cantConnectToPal}
      <div class="cant-connect-container">
        <p>Could not connect to {AQUA_PAL_NAME} for now...</p>
        <p>Wait, try to restart {AQUA_PAL_NAME} or try to log in.</p>
        <div class="try-login-button-container">
          <PrimaryButton label="Try to log in" type="green" onclick={() => window.location.reload()} />
        </div>
      </div>
    {/if}
    <div class="loading-container">
      <p>Restarting {AQUA_PAL_NAME}...</p>
      <Loader size="medium" theme="dark" />
    </div>
  {:else}
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
        {#each sortWifiList(bluetoothStore.wifiList) as wifiNetwork (wifiNetwork.fingerprint)}
          <WifiNetworkCard {wifiNetwork} isSelected={wifiNetwork.fingerprint === wifiNetworkFingerprint} onSelect={onWifiNetworkSelect} />
        {/each}
      {/if}
    </div>
    <div class="modify-row">
      <label for="network_pass">
        <span class="main-label">Network password:</span> <span class="public-indication">(leave empty if the network is public)</span>
      </label>
      <PasswordInput placeholder="Network password" onInput={(value) => (wifiPass = value)} id="network_pass" />
    </div>
    <div class="modify-row">
      <label for="login_pass">
        <span class="main-label">Login password:</span>
      </label>
      <PasswordInput placeholder="Login password" onInput={(value) => (loginPass = value)} id="login_pass" />
    </div>
    <div class="bottom">
      <ErrorField messages={errorMessage} />
      <PrimaryButton label="Save" disabled={!ssid || !loginPass} isLoading={validateLoading} onclick={onValidate} />
    </div>
  {/if}
</div>

<style lang="scss">
  .wifi-setup-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

  .cant-connect-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
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

  .public-indication {
    font-size: var(--font-S);
  }

  .try-login-button-container {
    margin: 16px 0;
  }
</style>

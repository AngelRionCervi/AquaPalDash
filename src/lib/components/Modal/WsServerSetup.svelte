<script lang="ts">
  import { onMount } from 'svelte';
  import PrimaryButton from '../Buttons/PrimaryButton.svelte';
  import {
    BLUETOOTH_CHARACTERISTICS_UUID_MAP,
    BT_WS_SERVER_HOSTNAME_CHARACTERISTIC_NAME,
    BT_WS_SERVER_PORT_CHARACTERISTIC_NAME
  } from '$lib/constants';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';

  let wsServerHostName = $state<string>('');
  let wsServerPort = $state<string>('');
  let currentHost = $state<string>('');
  let validateLoading = $state<boolean>(false);
  let errorMessage = $state<string | null>(null);
  let wsServerSetupDone = $state<boolean>(false);

  const { toggle } = modalStore;

  const defaultWsServerPort = 3000;

  async function onValidate() {
    const newCredValues = {
      [BT_WS_SERVER_HOSTNAME_CHARACTERISTIC_NAME]: wsServerHostName || window.location.hostname,
      [BT_WS_SERVER_PORT_CHARACTERISTIC_NAME]: wsServerPort || ''
    } as Record<keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, string>;

    try {
      validateLoading = true;

      const newWsServerInfo = await bluetoothStore.writeToMultipleCharacteristics(newCredValues);
      if (newWsServerInfo.every((r) => !!r)) {
        wsServerSetupDone = true;
        return;
      }
    } catch (error) {
      errorMessage = 'Could not save the websocket server informations. Please try again.';
      console.error(`${errorMessage}: ${error}`);
    } finally {
      validateLoading = false;
    }
  }

  $effect(() => {
    if (wsServerSetupDone) {
      toggle('wifiSetup', {
        backButtonHandler: () => {
          toggle('wsServerSetup');
        }
      });
    }
  });

  onMount(() => {
    modalStore.childProps = { ...modalStore.childProps, backButtonHandler: () => window.location.reload() };
    currentHost = window.location.hostname;
  });
</script>

<div class="ws-server-setup-container">
  <div class="modify-row">
    <label for="ws_server_host">Websocket server host (default to {currentHost}):</label>
    <input type="text" id="ws_server_host" bind:value={wsServerHostName} placeholder={currentHost} />
  </div>
  <div class="modify-row">
    <label for="ws_server_port">Websocket server port (default to {defaultWsServerPort}):</label>
    <input type="number" id="ws_server_port" bind:value={wsServerPort} placeholder={defaultWsServerPort.toString()} />
  </div>
  <div class="bottom">
    <PrimaryButton label="Save" isLoading={validateLoading} onclick={onValidate} />
  </div>
</div>

<style lang="scss">
  .ws-server-setup-container {
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
</style>

<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import ErrorField from './ErrorField.svelte';

  const { id } = modalStore.childProps || {};
  const { name, ip } = configStore.config?.devices.find((device) => device.id === id) || {};

  let newName = $state<string | undefined>(name);
  let nameErrorMsg = $state<string | null>(null);
  let newIp = $state<string | undefined>(ip);
  let ipErrorMsg = $state<string | null>(null);

  function checkNameError() {
    if (!newName) {
      nameErrorMsg = 'Name cannot be empty';
    } else {
      nameErrorMsg = null;
    }
  }

  function checkIpError() {
    if (!newIp) {
      ipErrorMsg = 'IP cannot be empty';
    } else {
      ipErrorMsg = null;
    }
  }

  function onEdit() {
    checkNameError();
    checkIpError();
    if (!newName || !newIp || (newName === name && newIp === ip)) return;
    configStore.updateDevice(id, { ip: newIp, name: newName });
    modalStore.toggle();
  }
</script>

<div class="modify-name-device-container">
  <div class="modify-row">
    <label for="device-name">Device name:</label>
    <input type="text" id="device-name" bind:value={newName} maxlength="40" />
  </div>
  <div class="modify-row">
    <label for="device-ip">Device ip:</label>
    <input type="text" id="device-ip" bind:value={newIp} maxlength="100" />
  </div>
  <div class="bottom">
    <ErrorField messages={nameErrorMsg} />
    <ErrorField messages={ipErrorMsg} />
    <PrimaryButton label="Save" disabled={!newName || !newIp || (newName === name && newIp === ip)} onclick={onEdit} />
  </div>
</div>

<style lang="scss">
  .modify-name-device-container {
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
</style>

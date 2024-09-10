<script lang="ts">
  import modalStore from '$lib/stores/modalStore.svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import authStore from '$lib/stores/authStore.svelte';

  const { toggle } = modalStore;

  function onResetWifiSettings() {
    try {
      configStore.updateSecret('wifiSSID', '');
      configStore.updateSecret('wifiPass', '');
      configStore.uploadNewConfig();
      controllerStore.restartController();
      authStore.removeSession();
      setTimeout(() => {
        toggle();
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error(`Error resetting wifi credentials: ${err}`);
    }
  }
</script>

<div class="warning-reset-wifi-container">
  <div class="warning-area">
    <span class="reset-label">Reset Wi-Fi settings and log-out to provide new network settings via bluetooth?</span>
  </div>
  <div class="button-row">
    <PrimaryButton label="Cancel" onclick={() => toggle()} />
    <PrimaryButton
      label="Reset Wi-Fi settings"
      isLoading={configStore.callStates.uploadNewConfig.isLoading}
      type="red"
      onclick={onResetWifiSettings}
    />
  </div>
</div>

<style lang="scss">
  .warning-reset-wifi-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 48px;
  }

  .button-row {
    display: flex;
    justify-content: center;
    gap: 32px;
    width: 60%;
  }

  .warning-area {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border-radius: var(--radius-S);
    background-color: var(--warning-lighter);
    max-width: 60%;
  }

  .reset-label {
    font-size: var(--font-M);
    font-weight: bold;
  }
</style>

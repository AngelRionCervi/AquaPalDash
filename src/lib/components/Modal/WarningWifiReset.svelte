<script lang="ts">
  import modalStore from '$lib/stores/modalStore.svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';

  let isLoading = $state(false);

  const { toggle } = modalStore;

  function onResetWifiSettings() {
    console.log('wip reset wifi settings');
  }
</script>

<div class="warning-reset-wifi-container">
  <div class="warning-area">
    <span class="reset-label">Reset Wi-Fi settings and log out to provide another network through bluetooth?</span>
  </div>
  <div class="button-row">
    <PrimaryButton label="Cancel" type="green" onclick={() => toggle()} />
    <PrimaryButton label="Reset Wi-Fi settings" {isLoading} type="red" onclick={onResetWifiSettings} />
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
    justify-content: space-between;
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

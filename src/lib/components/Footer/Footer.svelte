<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import UndoIcon from '$lib/icons/undo.svg?component';
  import modalStore from '$lib/stores/modalStore.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import { MAX_DEVICES } from '$lib/constants';
  import { page } from '$app/stores';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import authStore from '$lib/stores/authStore.svelte';

  const { toggle } = modalStore;

  function onAddDevice() {
    toggle('addDevice', {}, '');
  }

  function onRemoveDevices() {
    toggle('removeDevices', {}, '');
  }

  function onUndoModifications() {
    configStore.undoModifications();
  }

  function onSaveAndRestart() {
    if (authStore.isDemoMode) {
      configStore.updateMockConfig();
      return;
    }
    configStore.uploadNewConfig();
  }
</script>

<div class="footer-container">
  <div class="top-bar"></div>
  <div class="footer">
    <div class="left-container">
      {#if $page.url.pathname === '/devices'}
        <span>slots used <b>{configStore.config?.devices.length || '?'}/{MAX_DEVICES}</b></span>
        <PrimaryButton
          label="Add device"
          icon="add"
          disabled={(configStore.config?.devices.length || MAX_DEVICES) === MAX_DEVICES}
          onclick={onAddDevice}
        />
        <PrimaryButton label="Remove devices" icon="bin" disabled={configStore.config?.devices.length === 0} onclick={onRemoveDevices} />
      {/if}
    </div>
    <div class="right-container">
      {#if !configStore.isSync && !configStore.callStates.uploadNewConfig.isLoading}
        <div class="unsaved-infos">
          <p>Some modifications are <span class="unsaved-label">unsaved</span></p>
          <button class="button-undo" onclick={onUndoModifications}>
            <svelte:component this={UndoIcon} width={14} height={14} fill="var(--secondary)" />
            <span>Undo all modifications</span>
          </button>
        </div>
      {:else if configStore.callStates.uploadNewConfig.isLoading}
        <p>Uploading new configuration...</p>
      {:else if controllerStore.isRestarting}
        <p>Controller restarting...</p>
      {:else}
        <p>Configuration is up to date</p>
      {/if}
      <PrimaryButton
        type="green"
        label="Save and restart"
        disabled={configStore.isSync}
        onclick={onSaveAndRestart}
        isLoading={configStore.callStates.uploadNewConfig.isLoading || controllerStore.isRestarting}
      />
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/variables.scss';

  .footer-container {
    width: 100%;
    background-color: var(--primary);
  }

  .top-bar {
    position: absolute;
    left: 0;
    height: 1px;
    width: 100%;
    background-color: var(--secondary);
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 64px;
    gap: 32px;
    font-size: var(--font-M);
    background-color: var(--primary);

    @media (max-width: variables.$mobile-bp) {
      padding: 16px 32px;
      gap: 20px;
      flex-direction: column;
      font-size: var(--font-S);
    }
  }

  .left-container {
    display: flex;
    align-items: center;
    gap: 32px;

    @media (max-width: variables.$mobile-bp) {
      gap: 24px;
    }
  }

  .right-container {
    display: flex;
    align-items: center;
    gap: 32px;

    @media (max-width: variables.$mobile-bp) {
      gap: 20px;
    }
  }

  .unsaved-infos {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .unsaved-label {
    color: var(--primary-error);
  }

  .button-undo {
    display: flex;
    align-items: center;
    gap: 6px;

    span {
      font-size: var(--font-S);
      text-decoration: underline;
    }
  }
</style>

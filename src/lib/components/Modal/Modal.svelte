<script lang="ts">
  import type { Component } from 'svelte';
  import type { ModalTypes, ModalSpecs } from './types';
  import modalStore from '$lib/stores/modalStore.svelte';
  import CloseIcon from '$lib/icons/close.svg?component';
  import ScheduleSetting from './ScheduleSetting.svelte';
  import ButtonSlotSetting from './ButtonSlotSetting.svelte';
  import RemoveDevices from './RemoveDevices.svelte';
  import AddDevice from './AddDevice.svelte';
  import ModifyDevice from './ModifyDevice.svelte';
  import Login from './Login.svelte';
  import WifiSetup from './WifiSetup.svelte';
  import WarningWifiReset from './WarningWifiReset.svelte';
  import ArrowLeftIcon from '$lib/icons/arrow-left.svg?component';
  import WarningIcon from '$lib/icons/warning.svg?component';
  import ModifyPassword from './ModifyPassword.svelte';
  import WifiSetupLogin from './WifiSetupLogin.svelte';
  import PhCalibration from './PhCalibration/PhCalibration.svelte';
  import WsServerSetup from './WsServerSetup.svelte';

  type ModalChildMap = {
    [key in ModalTypes]: Component;
  };

  const { toggle } = modalStore;

  const modalChildMap: ModalChildMap = {
    scheduleSetting: ScheduleSetting,
    buttonSlotSetting: ButtonSlotSetting,
    removeDevices: RemoveDevices,
    addDevice: AddDevice,
    modifyDevice: ModifyDevice,
    login: Login,
    wifiSetup: WifiSetup,
    wifiSetupLogin: WifiSetupLogin,
    wsServerSetup: WsServerSetup,
    warningWifiReset: WarningWifiReset,
    modifyPassword: ModifyPassword,
    phCalibration: PhCalibration
  };

  const modalSpecs: ModalSpecs = {
    scheduleSetting: {
      title: 'Schedule Edit'
    },
    buttonSlotSetting: {
      title: 'Button Edit'
    },
    removeDevices: {
      title: 'Remove Devices'
    },
    addDevice: {
      title: 'Add Device'
    },
    modifyDevice: {
      title: 'Modify Device'
    },
    login: {
      title: 'Log in',
      isStatic: true
    },
    wifiSetup: {
      title: 'Wi-Fi Setup',
      isStatic: true
    },
    wifiSetupLogin: {
      title: 'Log in',
      isStatic: true
    },
    warningWifiReset: {
      title: '',
      variant: 'warning'
    },
    modifyPassword: {
      title: 'Change Password'
    },
    phCalibration: {
      title: 'Calibrate PH Probe',
    },
    wsServerSetup: {
      title: 'WebSocket Server Setup',
      isStatic: true
    }
  };
</script>

{#if modalStore.isOpen && modalStore.type}
  <div class="modal-container" style="top: calc(50% + {modalStore.scrolledTop}px);" class:modal-warning={modalSpecs[modalStore.type]?.variant === 'warning'}>
    <div class="modal-header">
      <div class="modal-top-left">
        <div class="button-title-container">
          {#if modalStore.childProps?.backButtonHandler}
            <button
              class="back-button"
              class:button-froze={modalStore.frozen}
              disabled={modalStore.frozen}
              onclick={() => modalStore.childProps?.backButtonHandler()}
            >
              <ArrowLeftIcon width={32} height={32} />
            </button>
          {/if}
          <span class="modal-title">{modalSpecs[modalStore.type]?.title || ''}</span>
        </div>
        <span class="modal-subtitle">{modalStore?.subtitle || ''}</span>
      </div>
      {#if modalSpecs[modalStore.type || '']?.variant === 'warning'}
        <div class="warning-icon-container">
          <WarningIcon width={64} height={64} />
        </div>
        {#if modalSpecs[modalStore.type || '']?.isStatic}
          <div class="empty-div"></div>
        {/if}
      {/if}
      {#if !modalSpecs[modalStore.type || '']?.isStatic}
        <button class="close-button" disabled={modalStore.frozen} class:button-froze={modalStore.frozen} onclick={() => toggle()}>
          <CloseIcon width={32} height={32} />
        </button>
      {/if}
    </div>
    <div>
      {#if modalStore.type}
        <svelte:component this={modalChildMap[modalStore.type]} {...modalStore.childProps} />
      {/if}
    </div>
  </div>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" style="top: calc({modalStore.scrolledTop}px - 50vh);" onclick={() => (modalStore.type && !modalStore.frozen && !modalSpecs[modalStore.type]?.isStatic ? toggle() : null)}></div>
{/if}

<style lang="scss">
  @use '$lib/variables.scss';

  .backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    width: 200vw;
    height: 200vh;
    position: absolute;
    left: 0;
    z-index: 20;
  }

  .modal-container {
    min-width: 600px;
    z-index: 21;
    border: 1px solid var(--secondary);
    border-radius: var(--radius-XL);
    padding: 24px;
    background-color: var(--primary);
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    &.modal-warning {
      border: 4px solid var(--warning);
    }

    @media screen and (max-width: variables.$mobile-bp) {
      min-width: unset;
      width: 95vw;
      padding: 16px;
    }

    @media screen and (max-width: variables.$small-mobile-bp) {
      font-size: var(--font-S);
    }
  }

  .modal-top-left {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    min-width: 32px;
  }

  .modal-title {
    font-size: var(--font-L);
    font-weight: bold;

    @media screen and (max-width: variables.$small-mobile-bp) {
      font-size: var(--font-M);
    }
  }

  .modal-subtitle {
    font-size: var(--font-M);
    margin-bottom: 4px;

    @media screen and (max-width: variables.$small-mobile-bp) {
      font-size: var(--font-S);
      margin-bottom: 0;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  .button-title-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .back-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-S);

    &:hover {
      background-color: var(--primary-darker);
    }
  }

  .warning-icon-container {
    color: var(--warning);
  }

  .close-button {
    display: flex;
    border-radius: var(--radius-S);

    &:hover {
      background-color: var(--primary-darker);
    }
  }

  .empty-div {
    min-width: 32px;
  }

  .button-froze {
    cursor: default;
    pointer-events: none;
    opacity: 0.4;
  }
</style>

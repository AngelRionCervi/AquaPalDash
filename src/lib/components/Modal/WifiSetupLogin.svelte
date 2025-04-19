<script lang="ts">
  import { onMount } from 'svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from './ErrorField.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import PasswordInput from '$lib/components/Inputs/PasswordInput.svelte';
  import authStore from '$lib/stores/authStore.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import { AQUA_PAL_NAME, BT_RESTART_CHARACTERISTIC_NAME, CONNECT_TO_PAL_AFTER_SETUP_TIMEOUT } from '$lib/constants';
  import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';
  import { sendWSMessage } from '$lib/wsClient/WSClientHandler';
  import Loader from '$lib/components/Loaders/Loader.svelte';
  import configStore from '$lib/stores/configStore.svelte';

  const { toggle } = modalStore;
  const configCheckPeriode = 3000;

  let loginErrorMsg = $state<string | null>(null);
  let password = $state('');
  let email = $state('');
  let rememberMe = $state(false);
  let configDone = $state(false);
  let cantConnectToPal = $state<boolean>(false);
  let isLoading = $state(false);

  let handshakeInterval: ReturnType<typeof setInterval> | null = null;
  let cantConnectToPalTimeout: ReturnType<typeof setTimeout> | null = null;

  async function checkUser() {
    isLoading = true;
    const userExists = await authStore.checkIfUserExists(email, password);

    if (!userExists) {
      isLoading = false;
      return false;
    }

    return true;
  }

  async function completeConfig() {
    configDone = true;

    if (rememberMe) {
      authStore.saveSession({ email, password, demoMode: false });
    }
    authStore.setPassword(password);
    authStore.setEmail(email);

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
      data: { email, password }
    };

    handshakeInterval = setInterval(() => {
      sendWSMessage(handshakePayload);
    }, configCheckPeriode);
  }

  async function onLoginClick() {
    if (!email.includes('@') || !email.includes('.')) {
      loginErrorMsg = 'Please enter a valid email';
      return;
    }
    if (!email || !password) {
      loginErrorMsg = 'Please enter a valid email and password';
      return;
    } else {
      loginErrorMsg = null;
      const userExists = await checkUser();
      if (userExists) {
        completeConfig();
      }
    }
  }

  onMount(() => {
    loginErrorMsg = null;
    password = '';
    email = '';

    return () => {
      if (handshakeInterval) {
        clearInterval(handshakeInterval);
      }
      if (cantConnectToPalTimeout) {
        clearTimeout(cantConnectToPalTimeout);
      }
      isLoading = false;
    };
  });

  $effect(() => {
    if (configStore.config) {
      bluetoothStore.stopBluetooth();
      toggle();
    }
  });
</script>

<div class="wifi-setup-login-container">
  {#if configDone}
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
    <div class="top">
      <div class="input-row">
        <label for="login_email">Email:</label>
        <input type="email" id="login_email" placeholder="Email" bind:value={email} maxlength={100} />
      </div>
      <div class="input-row">
        <label for="login_pass">Password:</label>
        <PasswordInput
          placeholder="Password"
          id="login_pass"
          onInput={(value) => (password = value)}
          maxlength={100}
          onKeyPress={() => onLoginClick()}
        />
      </div>
      <div class="checkbox-rows">
        <div class="input-row-flat">
          <label for="remember_me_checkbox">Remember me:</label>
          <input type="checkbox" id="remember_me_checkbox" bind:checked={rememberMe} />
        </div>
      </div>
    </div>
    <div class="error-button-container">
      <ErrorField messages={loginErrorMsg || authStore.callStates.checkIfUserExists.error} />
      <PrimaryButton label="Log in" type="green" {isLoading} disabled={!password || !email} onclick={onLoginClick} />
    </div>
  {/if}
</div>

<style lang="scss">
  .wifi-setup-login-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    justify-content: space-between;
    align-items: center;
  }

  .top {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 60%;
    min-width: 250px;
  }

  .checkbox-rows {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
  }

  .error-button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .input-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-row-flat {
    display: flex;
    gap: 8px;
    align-items: center;
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

  .try-login-button-container {
    margin: 16px 0;
  }
</style>

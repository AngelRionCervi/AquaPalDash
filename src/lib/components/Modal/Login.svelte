<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from './ErrorField.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import PasswordInput from '../Inputs/PasswordInput.svelte';

  const { childProps, toggle } = modalStore;

  let loginErrorMsg = $state<string | null>(null);
  let btErrorMsg = $state<string | null>(null);
  let password = $state('');
  let demoMode = $state(false);
  let rememberMe = $state(false);

  function onLoginClick() {
    if (!password && !demoMode) {
      loginErrorMsg = 'Please enter a valid password';
      return;
    } else {
      loginErrorMsg = null;
      if (typeof childProps?.onLogin !== 'function') return;
      if (demoMode) {
        childProps?.onLogin('demo', rememberMe, demoMode);
      } else {
        childProps?.onLogin(password, rememberMe, demoMode);
      }
    }
  }

  function onDemoCheckBoxClick() {
    password = '';
    rememberMe = false;
  }

  function stopBluetoothSetup() {
    bluetoothStore.stopBluetooth();
    toggle('login', { onLogin: childProps?.onLogin });
  }

  async function onWifiSetup() {
    if (!bluetoothStore.isBluetoothEnabled) {
      btErrorMsg = 'Web bluetooth not compatible with this browser. Please use Chrome or Edge.';
    }
    const deviceFound = await bluetoothStore.findDevice();
    if (deviceFound) {
      bluetoothStore.toggleWifiListInterval(true);
      toggle('wifiSetup', { backButtonHandler: () => stopBluetoothSetup() });
      setTimeout(() => {
        bluetoothStore.updateWifiList();
      });
    }
  }
</script>

<div class="login-modal-container">
  <div class="top">
    <div class="input-row">
      <label for="login_pass">Password:</label>
      <PasswordInput
        placeholder="Login password"
        id="login_pass"
        onInput={(value) => (password = value)}
        disabled={demoMode}
        maxlength={60}
        onKeyPress={() => onLoginClick()}
      />
    </div>
    <div class="checkbox-rows">
      <div class="input-row-flat">
        <label for="remember_me_checkbox">Remember me:</label>
        <input type="checkbox" id="remember_me_checkbox" disabled={demoMode} bind:checked={rememberMe} />
      </div>
      <div class="input-row-flat">
        <label for="demo_mode_checkbox">Demo mode:</label>
        <input type="checkbox" id="demo_mode_checkbox" bind:checked={demoMode} onclick={onDemoCheckBoxClick} />
      </div>
    </div>
  </div>
  <div class="error-button-container">
    <ErrorField messages={loginErrorMsg} />
    <PrimaryButton label="Log in" type="green" disabled={!password && !demoMode} onclick={onLoginClick} />
  </div>
  <div>
    <span class="or-divider">— OR —</span>
  </div>
  <div class="error-button-container">
    <ErrorField messages={btErrorMsg} />
    <PrimaryButton icon="bluetooth" label="Connect Aqua Pal to Wi-Fi" type="green" size="small" onclick={onWifiSetup} />
  </div>
</div>

<style lang="scss">
  .login-modal-container {
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

  .or-divider {
    font-size: var(--font-M);
  }
</style>

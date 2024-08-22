<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from './ErrorField.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';

  const { childProps } = modalStore;

  let errorMessage = $state<string | null>(null);
  let password = $state('');
  let demoMode = $state(false);
  let rememberMe = $state(false);

  async function onLoginClick() {
    console.log('login');

    if (!password && !demoMode) {
      errorMessage = 'Please enter a valid password';
      return;
    } else {
      errorMessage = null;
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
</script>

<div class="login-modal-container">
  <div class="top">
    <div class="input-row">
      <label for="login_pass">Password:</label>
      <input type="password" id="login_pass" bind:value={password} disabled={demoMode} maxlength="60" />
    </div>
    <div class="input-row-flat">
      <label for="remember_me_checkbox">Remember me:</label>
      <input type="checkbox" id="remember_me_checkbox" disabled={demoMode} bind:checked={rememberMe} />
    </div>
    <div class="input-row-flat">
      <label for="demo_mode_checkbox">Demo mode:</label>
      <input type="checkbox" id="demo_mode_checkbox" bind:checked={demoMode} onclick={onDemoCheckBoxClick} />
    </div>
  </div>
  <div class="bottom">
    <ErrorField messages={errorMessage} />
    <PrimaryButton label="Login" type="green" disabled={!password && !demoMode} onclick={onLoginClick} />
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
  }

  .bottom {
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
</style>

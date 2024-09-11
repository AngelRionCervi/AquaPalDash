<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import authStore from '$lib/stores/authStore.svelte';
  import ErrorField from './ErrorField.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import PasswordInput from '$lib/components/Inputs/PasswordInput.svelte';
  import { MIN_PASSWORD_LENGTH } from '$lib/constants';
  import { onMount } from 'svelte';
  import SuccessField from './SuccessField.svelte';

  const { toggle } = modalStore;
  const reloadDelay = 3000;

  let oldPassword = $state('');
  let newPassword1 = $state('');
  let newPassword2 = $state('');
  let successMsg = $state('');

  async function onEdit() {
    if (newPassword1.toString() !== newPassword2.toString()) {
      authStore.modifyPasswordError = 'New passwords do not match';
      return;
    } else if (newPassword1.length < MIN_PASSWORD_LENGTH) {
      authStore.modifyPasswordError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
      return;
    }
    modalStore.frozen = true;
    await authStore.modifyUserPassword(oldPassword, newPassword1);
    if (!authStore.modifyPasswordError) {
      successMsg = 'Password changed successfully ! Restarting...';
      setTimeout(() => {
        toggle();
        modalStore.frozen = false;
        authStore.removeSessionAndReload();
      }, reloadDelay);
    } else {
      modalStore.frozen = false;
    }
  }

  onMount(() => {
    authStore.modifyPasswordError = '';
    successMsg = '';
  });
</script>

<div class="modify-password-container">
  <div class="modify-row">
    <label for="old_pass">Old password:</label>
    <PasswordInput id="old_pass" onInput={(value) => (oldPassword = value)} maxlength={100} minlength={6} />
  </div>
  <div class="divider"></div>
  <div class="modify-row">
    <label for="new_pass_1">New password:</label>
    <PasswordInput id="new_pass_1" onInput={(value) => (newPassword1 = value)} maxlength={100} minlength={6} />
  </div>
  <div class="modify-row">
    <label for="new_pass_2">Repeat new password:</label>
    <PasswordInput id="new_pass_2" onInput={(value) => (newPassword2 = value)} maxlength={100} minlength={6} />
  </div>
  <div class="bottom">
    <ErrorField messages={authStore.modifyPasswordError} />
    <SuccessField messages={successMsg} />
    <PrimaryButton
      label="Save"
      isLoading={authStore.callStates.modifyPassword.isLoading}
      disabled={!oldPassword || !newPassword1 || !newPassword2}
      onclick={onEdit}
    />
  </div>
</div>

<style lang="scss">
  .modify-password-container {
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

  .divider {
    width: 30%;
    height: 1px;
    background-color: var(--secondary-lighter);
    margin: 12px 0;
  }
</style>

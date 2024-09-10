<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import authStore from '$lib/stores/authStore.svelte';
  import ErrorField from './ErrorField.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import PasswordInput from '$lib/components/Inputs/PasswordInput.svelte';
  import { MIN_PASSWORD_LENGTH } from '$lib/constants';
  import { onMount } from 'svelte';

  const { toggle } = modalStore;

  let oldPassword = $state('');
  let newPassword1 = $state('');
  let newPassword2 = $state('');

  async function onEdit() {
    console.log('edit pw', newPassword1, newPassword2, authStore.password, newPassword1 !== newPassword2);
    if (newPassword1.toString() !== newPassword2.toString()) {
      authStore.modifyPasswordError = 'New passwords do not match';
      return;
    } else if (newPassword1.length < MIN_PASSWORD_LENGTH) {
      authStore.modifyPasswordError = 'Password must be at least 6 characters long';
      return;
    }
    await authStore.modifyUserPassword(oldPassword, newPassword1);
    console.log('edit pw', authStore.modifyPasswordError);
    if (!authStore.modifyPasswordError) {
      toggle();
    }
  }

  onMount(() => {
    authStore.modifyPasswordError = '';
  });
</script>

<div class="modify-password-container">
  <div class="modify-row">
    <label for="old_pass">Old password:</label>
    <PasswordInput id="old_pass" onInput={(value) => (oldPassword = value)} maxlength={40} minlength={6} />
  </div>
  <div class="divider"></div>
  <div class="modify-row">
    <label for="new_pass_1">New password:</label>
    <PasswordInput id="new_pass_1" onInput={(value) => (newPassword1 = value)} maxlength={40} minlength={6} />
  </div>
  <div class="modify-row">
    <label for="new_pass_2">Repeat new password:</label>
    <PasswordInput id="new_pass_2" onInput={(value) => (newPassword2 = value)} maxlength={40} minlength={6} />
  </div>
  <div class="bottom">
    <ErrorField messages={authStore.modifyPasswordError} />
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

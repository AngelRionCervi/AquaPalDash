<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from './ErrorField.svelte';

  let oldPassword = $state('');
  let newPassword1 = $state('');
  let newPassword2 = $state('');
  let errorMsg = $state('');

  function onEdit() {
    if (newPassword1 !== newPassword2) {
      errorMsg = 'New passwords do not match';
      console.error(errorMsg);
      return;
    }
    console.log('edit pw');
  }
</script>

<div class="modify-password-container">
  <div class="modify-row">
    <label for="device-name">Old password:</label>
    <input type="text" id="device-name" bind:value={oldPassword} maxlength="40" />
  </div>
  <div class="divider"></div>
  <div class="modify-row">
    <label for="device-name">New password:</label>
    <input type="text" id="device-name" bind:value={newPassword1} maxlength="40" />
  </div>
  <div class="modify-row">
    <label for="device-name">Repeat new password:</label>
    <input type="text" id="device-name" bind:value={newPassword2} maxlength="40" />
  </div>
  <div class="bottom">
    <ErrorField messages={errorMsg} />
    <PrimaryButton label="Save" disabled={!oldPassword || !newPassword1 || !newPassword2} onclick={onEdit} />
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
    width: 40%;
    height: 1px;
    background-color: var(--secondary);
  }
</style>

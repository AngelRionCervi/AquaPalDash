<script lang="ts">
  import settings from '$lib/data/settings';
  import SettingSlot from '$lib/components/Settings/SettingSlot.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import authStore from '$lib/stores/authStore.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import type { ConfigSettings } from '$lib/types';

  const { toggle } = modalStore;

  async function onSettingChange(settingName: keyof ConfigSettings, value: string | number | boolean) {
    if (configStore.config) {
      configStore.updateSetting(settingName, value);
    }
  }
</script>

<div class="settings-main-container">
  <div class="settings-container">
    {#each settings as setting, index}
      <SettingSlot {setting} {index} currentValue={configStore.config?.settings[setting.name as keyof ConfigSettings] ?? ''} {onSettingChange} />
    {/each}
  </div>
  <div class="special-control-row">
    <PrimaryButton label="Reset Wi-Fi settings" type="green" onclick={() => toggle('warningWifiReset')} disabled={!controllerStore.isOn} />
    <PrimaryButton
      label="Restart controller"
      type="green"
      onclick={() => controllerStore.restartController()}
      disabled={!controllerStore.isOn}
    />
    <PrimaryButton label="Forget session" type="green" disabled={!controllerStore.isOn} onclick={() => authStore.removeSessionAndReload()} />
    <PrimaryButton label="Change password" type="green" disabled={!controllerStore.isOn} onclick={() => toggle('modifyPassword')} />
  </div>
  <div class="special-control-row">
    <PrimaryButton label="Calibrate PH" type="default" icon="gear" disabled={!controllerStore.isOn} onclick={() => toggle('phCalibration')} />
  </div>
</div>

<style lang="scss">
  @use '$lib/variables.scss';

  .settings-main-container {
    justify-content: center;
    align-items: center;
    display: flex;
    margin: 0 64px 64px 64px;
    height: 100%;
    flex-direction: column;
    gap: 64px;

    @media screen and (max-width: variables.$mobile-bp) {
      gap: 32px;
      margin: 0;
      overflow: auto;
    }
  }

  .settings-container {
    overflow: auto;
    width: 100%;
    max-width: 1000px;
  }

  .special-control-row {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
    gap: 32px;
    flex-wrap: wrap;
  }
</style>

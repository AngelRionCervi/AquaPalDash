<script lang="ts">
	import settings from '$lib/data/settings';
	import SettingSlot from '$lib/components/Settings/SettingSlot.svelte';
	import configStore from '$lib/stores/configStore.svelte';
  import monitoringStore from '$lib/stores/monitoringStore.svelte';

	async function onSettingChange(settingName: keyof ConfigSettings, value: string | number | boolean) {
		if (configStore.config) {
			configStore.updateSetting(settingName, value);
		}
    if (settingName === "enableMonitoring") {
      if (value) {
        await monitoringStore.fetchHistoricals();
        monitoringStore.updateLastWithInterval();
      } else {
        monitoringStore.clearUpdateInterval();
      }
    }
	}
</script>

<div class="settings-main-container">
	<div class="settings-container">
		{#each settings as setting, index}
			<SettingSlot
				{setting}
				{index}
        isLast={index === settings.length - 1}
				currentValue={configStore.config?.settings[(setting.name as keyof ConfigSettings)] ?? ''}
				{onSettingChange}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
  @import '$lib/variables.scss';

	.settings-main-container {
		justify-content: center;
		display: flex;
		margin: 0 64px 64px 64px;
		height: 100%;

    @media screen and (max-width: $mobile-bp) {
      margin: 0;
      overflow: auto;
    }
	}

	.settings-container {
		width: 100%;
	}
</style>

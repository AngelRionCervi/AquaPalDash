<script lang="ts">
	import settings from '$lib/data/settings';
	import SettingSlot from '$lib/components/Settings/SettingSlot.svelte';
	import configStore from '$lib/stores/configStore.svelte';

	function onSettingChange(settingName: keyof ConfigSettings, value: unknown) {
		if (configStore.config) {
			configStore.updateSetting(settingName, value);
		}
	}
</script>

<div class="settings-main-container">
	<div class="settings-container">
		{#each settings as setting, index}
			<SettingSlot
				{setting}
				{index}
				currentValue={configStore.config?.settings[(setting.name as keyof ConfigSettings)] ?? ''}
				{onSettingChange}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	.settings-main-container {
		justify-content: center;
		display: flex;
		margin: 0 64px;
		height: 100%;
	}

	.settings-container {
		width: 100%;
	}
</style>

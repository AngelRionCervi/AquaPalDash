<script lang="ts">
	import settings from '$lib/data/settings';
	import SettingSlot from '$lib/components/Settings/SettingSlot.svelte';
</script>

<div class="settings-main-container">
	<div class="settings-container">
		{#each settings as setting, index}
			<SettingSlot {setting} {index} />
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

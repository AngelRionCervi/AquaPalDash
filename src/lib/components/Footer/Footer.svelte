<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import UndoIcon from '$lib/icons/undo.svg?component';
	import modalStore from '$lib/stores/modalStore.svelte';
	import configStore from '$lib/stores/configStore.svelte';
	import { MAX_DEVICES } from '$lib/constants';

	const { toggle } = modalStore;

	function onAddDevice() {
		toggle('Add new device', 'addDevice');
	}

	function onRemoveDevices() {
		toggle('Remove devices', 'removeDevices');
	}

  function onUndoModifications() {
    configStore.undoModifications();
  }

	function onSaveAndRestart() {
		configStore.uploadNewConfig();
	}
</script>

<div class="footer">
	<div class="left-container">
		<span>slots {configStore.config?.devices.length || '?'}/{MAX_DEVICES}</span>
		<PrimaryButton
			label="Add new device"
			icon="add"
			disabled={(configStore.config?.devices.length || MAX_DEVICES) === MAX_DEVICES}
			onclick={onAddDevice}
		/>
		<PrimaryButton label="Remove devices" icon="bin" disabled={configStore.config?.devices.length === 0} onclick={onRemoveDevices} />
	</div>
	<div class="right-container">
		{#if !configStore.isSync && !configStore.callStates.uploadNewConfig.isLoading}
			<div class="unsaved-infos">
				<p>Some modifications are <span class="unsaved-label">unsaved</span></p>
				<button class="button-undo" onclick={onUndoModifications}>
					<svelte:component this={UndoIcon} width={14} height={14} fill="var(--secondary)" />
					<span>Undo all modifications</span>
				</button>
			</div>
		{:else if configStore.callStates.uploadNewConfig.isLoading}
      <p>Uploading new configuration...</p>
    {:else}
      <p>Configuration is up to date</p>
    {/if}
		<PrimaryButton
			type="green"
			label="Save and restart"
			disabled={configStore.isSync}
			onclick={onSaveAndRestart}
			isLoading={configStore.callStates.uploadNewConfig.isLoading}
		/>
	</div>
</div>

<style lang="scss">
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--secondary);
		width: 100vw;
		margin-left: -64px;
		padding: 32px 64px;
		gap: 32px;
	}

	.left-container {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.right-container {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.unsaved-infos {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: flex-start;
	}

	.unsaved-label {
		color: var(--primary-error);
	}

	.button-undo {
		display: flex;
		align-items: center;
		gap: 6px;

		span {
			font-size: var(--font-S);
			text-decoration: underline;
		}
	}
</style>

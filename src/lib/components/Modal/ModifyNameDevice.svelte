<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import configStore from '$lib/stores/configStore.svelte';
	import ErrorField from './ErrorField.svelte';

	const { id } = modalStore.childProps || {};
	const name = configStore.config?.devices.find((device) => device.id === id)?.name || '';

	let newName = $state(name);
	let errorMessage = $state<string | null>(null);

	function checkError() {
		if (name === newName) {
			errorMessage = 'The new name is the same';
		} else {
			errorMessage = null;
		}
	}

	function onNameEdit() {
		console.log('name edit');
		checkError();
		if (errorMessage) return;
		configStore.updateDevice(id, { name: newName });
		modalStore.toggle();
	}
</script>

<div class="modify-name-device-container">
	<div class="modify-name">
		<label for="device-name">Device name:</label>
		<input type="text" id="device-name" bind:value={newName} maxlength="40" />
	</div>
	<div class="bottom">
		<ErrorField messages={errorMessage} />
		<PrimaryButton label="Save" disabled={!!errorMessage || newName === name} onclick={onNameEdit} />
	</div>
</div>

<style lang="scss">
	.modify-name-device-container {
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

	.modify-name {
		width: 60%;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		justify-content: space-between;
	}
</style>

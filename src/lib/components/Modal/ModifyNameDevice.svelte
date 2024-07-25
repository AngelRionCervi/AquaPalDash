<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import configStore from '$lib/stores/configStore.svelte';

	const { name } = modalStore.childProps || {};

	let newName = $state(name);

	function onNameEdit() {
		console.log('name edit');
		configStore.updateDevice('name', newName);
		modalStore.toggle();
	}
</script>

<div class="modify-name-device-container">
	<div class="modify-name">
		<label for="device-name">Device name:</label>
		<input type="text" id="device-name" bind:value={newName} maxlength="40" />
	</div>
	<div class="save-container">
		<PrimaryButton label="Save" disabled={name === newName} onclick={onNameEdit} />
	</div>
</div>

<style lang="scss">
	.modify-name-device-container {
		display: flex;
		flex-direction: column;
		gap: 36px;
		justify-content: space-between;
		align-items: center;
	}

	.save-container {
		display: flex;
		justify-content: center;
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

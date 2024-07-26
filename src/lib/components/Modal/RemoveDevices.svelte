<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
  import configStore from '$lib/stores/configStore.svelte';

	const { toggle } = modalStore;

	let devicesList = $state(configStore.config?.devices.map(({ id, name }) => ({ id, name, checked: false })) || []);
	let numbersToRemove = $derived(devicesList.filter(({ checked }) => checked).length);

	function onRemoveDevices() {
    const devicesTopRemove = devicesList.filter(({ checked }) => checked).map(({ id }) => id);
    configStore.removeDevices(devicesTopRemove);
		toggle();
	}

	function onCheckboxChange(evt: Event, index: number) {
		const isChecked = (evt.target as HTMLInputElement)?.checked;
		if (devicesList[index]) {
			devicesList[index].checked = isChecked;
		}
	}
</script>

<div class="remove-device-container">
	<div class="top">
		<fieldset class="remove-devices-fields">
			{#each devicesList as { name, id, checked }, index (id)}
				<div class="device-row">
					<input
						class="checkbox-input"
						type="checkbox"
						id="{id}_id"
						value={id}
						name={id}
						{checked}
						oninput={(evt) => onCheckboxChange(evt, index)}
					/>
					<label for="{id}_id">{name}</label>
				</div>
			{/each}
		</fieldset>
	</div>
	<div class="bottom">
		<PrimaryButton
			label="Remove {numbersToRemove} device{numbersToRemove > 1 ? 's' : ''}"
			type="red"
			onclick={onRemoveDevices}
		/>
	</div>
</div>

<style lang="scss">
	.remove-device-container {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.device-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.top {
		display: flex;
		justify-content: center;
	}

	.bottom {
		display: flex;
		justify-content: center;
	}

	.remove-devices-fields {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.checkbox-input {
		&:checked {
			&:before {
				background-color: var(--primary-error-darker);
			}
		}
	}
</style>

<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';

	const { toggle } = modalStore;

	let devicesList = $state([
		{ name: 'filter', checked: false },
		{ name: 'light', checked: false },
		{ name: 'co2', checked: false }
	]);

	let numbersToRemove = $derived(devicesList.filter(({ checked }) => checked).length);

	function onRemoveDevices() {
		console.log('remove devices', numbersToRemove);
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
			{#each devicesList as { name, checked }, index (name)}
				<div class="device-row">
					<input
						class="checkbox-input"
						type="checkbox"
						id="{name}_id"
						value={name}
						{name}
						{checked}
						oninput={(evt) => onCheckboxChange(evt, index)}
					/>
					<label for="{name}_id">{name}</label>
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

<script lang="ts">
	import Select from '$lib/components/Inputs/Select.svelte';
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import configStore from '$lib/stores/configStore.svelte';
	import { MAX_DEVICES } from '$lib/constants';
	import ErrorField from './ErrorField.svelte';

	const { toggle, childProps } = modalStore;

	const selectId = `select_button_slot`;
	const availableButtons = getAvailableButtons();

	let newButtonSlot = $state<number | null>(availableButtons[0]?.value || null);
	let errorMessage = $state<string | null>(null);

	function onValidate() {
		checkForError();
		if (typeof newButtonSlot !== 'number') return;

		configStore.updateDevice(childProps?.id, { button: newButtonSlot });
		toggle();
	}

	function getAvailableButtons() {
		const devicesButtonArray = [
			...new Array(MAX_DEVICES).fill(0).map((val, index) => (val += index))
		];

		const availableButtons = devicesButtonArray
			.filter(
				(button) =>
					!(configStore.config?.devices || []).map((device) => device.button).includes(button)
			)
			.map((button) => ({ label: button + 1, value: button }));

		return availableButtons;
	}

	function onButtonChange(evt: Event) {
		const target = evt.target as HTMLSelectElement;
		const button = Number(target.value);

		newButtonSlot = button;

		checkForError();
	}

	function checkForError() {
		const currentDevice = configStore.config?.devices.find(
			(device) => device.id === childProps?.id
		);

		if (typeof newButtonSlot !== 'number') {
			errorMessage = 'Button needs to be a number';
		} else if (currentDevice?.button === newButtonSlot) {
			errorMessage = 'This button is already bound to this device';
		} else {
			errorMessage = null;
		}
	}
</script>

<div class="button-slot-setting-container">
	<div class="top">
		<div class="inner-container left">
			<div class="buttons-info-container">
				<span>Used buttons:</span>
				<table class="buttons-table">
					<tbody>
						{#each configStore.config?.devices || [] as { button, id, name } (id)}
							<tr class="table-row">
								<th>button {button + 1}:</th>
								<td>{name}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="buttons-info-container">
				<span>Free button{availableButtons.length > 1 ? 's' : ''}:</span>
				<div class="available-labels">
					{availableButtons.map(({ label }) => label).join(', ')}
				</div>
			</div>
		</div>
		<div class="separator"></div>
		<div class="inner-container right">
			{#if !availableButtons.length}
				<p class="all-buttons-bound">All buttons are already bound</p>
			{:else}
				<Select
					id={selectId}
					name="select_{selectId}"
					label="New button:"
					values={availableButtons}
					hasBorders
					onchange={onButtonChange}
				/>
			{/if}
		</div>
	</div>
	<div class="bottom">
		<ErrorField messages={errorMessage} />
		<PrimaryButton disabled={!!errorMessage} onclick={onValidate} label="OK" />
	</div>
</div>

<style lang="scss">
	@import '$lib/variables.scss';

	.button-slot-setting-container {
		display: flex;
		flex-direction: column;
		gap: 24px;
		justify-content: space-between;
	}

	.top {
		display: flex;
		justify-content: space-between;

		@media screen and (max-width: $mobile-bp) {
			flex-direction: column;
			align-items: center;
		}
	}

	.bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 16px;

		@media screen and (max-width: $mobile-bp) {
			margin-top: 8px;
		}
	}

	.separator {
		width: 1px;
		height: auto;
		background-color: var(--secondary);

		@media screen and (max-width: $mobile-bp) {
			width: 80%;
			height: 1px;
		}
	}

	.inner-container {
		padding: 16px;
		display: flex;
		justify-content: center;
		width: 100%;
		flex-direction: column;
		align-items: center;

		&.left {
			gap: 16px;
		}

		&.right {
			margin-top: -32px;

			@media screen and (max-width: $mobile-bp) {
				margin-top: 0;
        text-align: center;
			}
		}
	}

	.buttons-table {
		text-align: left;

		@media screen and (max-width: $mobile-bp) {
			text-align: center;
		}
	}

	.table-row {
		display: flex;
		justify-content: flex-start;
		gap: 8px;

		th,
		td {
			width: 90px;
		}

		@media screen and (max-width: $mobile-bp) {
			justify-content: center;
		}
	}

	.all-buttons-bound {
		text-align: center;
		font-weight: bold;
	}

	.buttons-info-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.available-labels {
		color: var(--primary-success);
		font-weight: bold;
	}
</style>

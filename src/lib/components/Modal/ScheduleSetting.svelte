<script lang="ts">
	import DoubleRangeSlider from '$lib/components/Inputs/DoubleRangeSlider.svelte';
	import { minsToReadableTime } from '$lib/helpers/utils';
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import scheduleRadioTypes from '$lib/data/scheduleSettings';
	import ErrorField from './ErrorField.svelte';

	const { toggle } = modalStore;

	const min = 0;
	const max = 24 * 60; // 1 day in minutes
	const step = 15;
	const defaultMin = 11 * 60; // 11h
	const defaultMax = 18 * 60; // 18h

	let scheduleType = $state('alwaysOn');
	let minTimeString = $state('');
	let maxTimeString = $state('');

	function onRangeChange({ min, max }: { min: number; max: number }) {
		minTimeString = minsToReadableTime(min);
		maxTimeString = minsToReadableTime(max);
	}

	function onValidate() {
		console.log('validate schedule');
		toggle();
	}

	function onRadioTypeChange(value: string) {
		scheduleType = value;
	}
</script>

<div class="schedule-setting-container">
	<div class="top">
		<div class="current-schedule">
			<div class="current-schedule-inner">
				<p class="label">Current:</p>
				<p class="value">On between 11h and 18h.</p>
			</div>
		</div>
		<div class="separator"></div>
		<div class="radio-schedule-type">
			<fieldset class="radio-schedule-type-inner">
				{#each scheduleRadioTypes as { id, name, value, checked, label } (id)}
					<div class="input-row">
						<input
							class="radio-input"
							type="radio"
							{id}
							{name}
							{value}
							{checked}
							onchange={() => onRadioTypeChange(value)}
						/>
						<label for={id}>{label}</label>
					</div>
				{/each}
			</fieldset>
		</div>
	</div>
	{#if scheduleType === 'range'}
		<div class="slider-container">
			<DoubleRangeSlider {min} {max} {step} {defaultMin} {defaultMax} onchange={onRangeChange} />
			<div class="new-schedule">
				<p>On between <b>{minTimeString}</b> and <b>{maxTimeString}</b>.</p>
			</div>
		</div>
	{/if}
	<div class="bottom">
		<ErrorField
			messages={['error example', "yet another error but this time it's veven longer lolol"]}
		/>
		<PrimaryButton onclick={onValidate} label="OK" />
	</div>
</div>

<style lang="scss">
	.schedule-setting-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 36px;
	}

	.separator {
		width: 1px;
		height: auto;
		background-color: var(--secondary);
	}

	.radio-schedule-type {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.radio-schedule-type-inner {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.top {
		width: 100%;
		height: 100px;
		display: flex;
		justify-content: space-between;
	}

	.slider-container {
		width: 100%;
	}

	.current-schedule {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.current-schedule-inner {
		width: fit-content;

		.label {
			font-size: var(--font-M);
			font-weight: bold;
		}
	}

	.new-schedule {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}

	.input-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.radio-input {
		&:checked {
			border: 6px solid var(--primary-success);
		}
	}

	.bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

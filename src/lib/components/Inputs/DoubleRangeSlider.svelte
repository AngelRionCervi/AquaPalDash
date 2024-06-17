<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		step: number;
		min: number;
		max: number;
		defaultMin: number;
		defaultMax: number;
		onchange: ({ min, max }: { min: number; max: number }) => void;
	}

	type InputOrNull = HTMLInputElement | null;

	const { step, min, max, defaultMin, defaultMax, onchange }: Props = $props();

	let selectedRangeEl: HTMLSpanElement;
	let rangeInputMinEl: InputOrNull;
	let rangeInputMaxEl: InputOrNull;
	let currentMinRange: number = $state(defaultMin);
	let currentMaxRange: number = $state(defaultMax);

	function onRangeInput() {
		if (!rangeInputMinEl || !rangeInputMaxEl) return;

		let minRange = parseInt(rangeInputMinEl.value);
		let maxRange = parseInt(rangeInputMaxEl.value);
		if (maxRange - minRange <= step && currentMinRange && currentMaxRange) {
			rangeInputMinEl.value = currentMinRange.toString();
			rangeInputMaxEl.value = currentMaxRange.toString();

			return;
		} else {
			console.log(parseInt(rangeInputMinEl.max), parseInt(rangeInputMaxEl.max));
			selectedRangeEl.style.left = (minRange / max) * 100 + '%';
			selectedRangeEl.style.right = 100 - (maxRange / max) * 100 + '%';
		}

		currentMinRange = minRange;
		currentMaxRange = maxRange;

		onchange({ min: currentMinRange, max: currentMaxRange });
	}

	onMount(() => {
		onRangeInput();
	});
</script>

<div class="range">
	<div class="range-slider">
		<span bind:this={selectedRangeEl} class="range-selected"></span>
	</div>
	<div class="range-input">
		<input
			bind:this={rangeInputMinEl}
			oninput={onRangeInput}
			type="range"
			class="min"
			{min}
			{max}
			value={defaultMin}
			{step}
		/>
		<input
			bind:this={rangeInputMaxEl}
			oninput={onRangeInput}
			type="range"
			class="max"
			{min}
			{max}
			value={defaultMax}
			{step}
		/>
	</div>
</div>

<style lang="scss">
	.range-slider {
		height: 4px;
		position: relative;
		background-color: var(--primary-darker);
		border-radius: 4px;
	}

	.range-selected {
		height: 100%;
		position: absolute;
		border-radius: 4px;
		background-color: var(--secondary-success);
	}

	.range-input {
		position: relative;

		input {
			padding: 0;
			position: absolute;
			width: 100%;
			height: 4px;
			top: -4px;
			background: none;
			pointer-events: none;
			-webkit-appearance: none;
			-moz-appearance: none;

			&::-webkit-slider-thumb {
				height: 20px;
				width: 20px;
				border-radius: 50%;
				border: 2px solid var(--secondary-success);
				background-color: var(--primary-success);
				pointer-events: auto;
				-webkit-appearance: none;
			}

			&::-moz-range-thumb {
				height: 15px;
				width: 15px;
				border-radius: 50%;
				border: 2px solid var(--secondary-success);
				background-color: var(--primary-success);
				pointer-events: auto;
				-moz-appearance: none;
			}
		}
	}
</style>

<script lang="ts">
	import { minutesToHours } from '$lib/helpers/utils';
	import { onMount } from 'svelte';

	type InputOrNull = HTMLInputElement | null;

	const RANGE_MAX = 1440;

	let minGap = 15;
	let selectedRangeEl: HTMLSpanElement;
	let rangeInputEls: [InputOrNull, InputOrNull] = [null, null];

	let currentMinRange: number;
	let currentMaxRange: number;

	function onRangeInput() {
		if (!rangeInputEls[0] || !rangeInputEls[1]) return;

		let minRange = parseInt(rangeInputEls[0].value);
		let maxRange = parseInt(rangeInputEls[1].value);
		if (maxRange - minRange <= minGap && currentMinRange && currentMaxRange) {
			rangeInputEls[0].value = currentMinRange.toString();
			rangeInputEls[1].value = currentMaxRange.toString();
			return;
		} else {
			console.log(parseInt(rangeInputEls[0].max), parseInt(rangeInputEls[1].max));
			selectedRangeEl.style.left = (minRange / RANGE_MAX) * 100 + '%';
			selectedRangeEl.style.right = 100 - (maxRange / RANGE_MAX) * 100 + '%';
		}

		currentMinRange = minRange;
		currentMaxRange = maxRange;

    console.log(minutesToHours(currentMinRange), minutesToHours(currentMaxRange));
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
			bind:this={rangeInputEls[0]}
			oninput={onRangeInput}
			type="range"
			class="min"
			min="0"
			max="1440"
			value="300"
			step="15"
		/>
		<input
			bind:this={rangeInputEls[1]}
			oninput={onRangeInput}
			type="range"
			class="max"
			min="0"
			max="1440"
			value="400"
			step="15"
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

<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from '$lib/components/Modal/ErrorField.svelte';
  import { onMount } from 'svelte';

  interface Props {
    calibrationTable: CalibrationTable;
    onValidate: (value: number | null) => void;
  }

  const { calibrationTable, onValidate }: Props = $props();
  const { min, max, label, validateLabel, unit } = $derived(calibrationTable);
  const id = $derived(`calibration_input_${label}`);

  let value = $state<number | null>(null);
  let valueError = $state<string>('');

  function onButtonClick() {
    if (!value || typeof value !== 'number') {
      valueError = 'Please enter a valid number';
      return;
    }
    if (min && value && value < min) {
      valueError = `Please enter a value greater than ${min}`;
      return;
    }
    if (max && value && value > max) {
      valueError = `Please enter a value less than ${max}`;
      return;
    }
    valueError = '';

    onValidate(value);
  }

  $effect(() => {
    if (id) {
      value = null;
    }
  });
</script>

<div class="calibration-input-container">
  <div class="input-row">
    <label for={id}>{label}:</label>
    <div class="input-and-unit">
      <input type="number" bind:value {min} {max} />
      <span>{unit}</span>
    </div>
  </div>
  <div class="button-container">
    <ErrorField messages={valueError} />
    <PrimaryButton onclick={() => onButtonClick()} type="green" label={validateLabel} />
  </div>
</div>

<style lang="scss">
  .calibration-input-container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 24px;
  }

  .input-row {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input-and-unit {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>

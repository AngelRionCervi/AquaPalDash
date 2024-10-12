<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ErrorField from '$lib/components/Modal/ErrorField.svelte';

  interface Props {
    calibrationTable: CalibrationTable;
    onValidate: (value: number | null) => void;
    value: number;
  }

  const { calibrationTable, onValidate, value }: Props = $props();
  const { min, max, validateLabel, unit } = $derived(calibrationTable);

  let valueError = $state<string>('');
  let fakeLoading = $state<boolean>(false);

  function onButtonClick() {
    if (!value || typeof value !== 'number') {
      valueError = 'the value shoudl be a valid number';
      return;
    }
    if (min && value && value < min) {
      valueError = `The value should be greater than ${min}`;
      return;
    }
    if (max && value && value > max) {
      valueError = `The value should be less than ${max}`;
      return;
    }
    valueError = '';

    fakeLoading = true;

    setTimeout(() => {
      fakeLoading = false;
      onValidate(value);
    }, 1000);
  }
</script>

<div class="calibration-input-container">
  <div class="input-row">
    <span class="value">{value}</span>
    <span class="unit">{unit}</span>
  </div>
  <div class="button-container">
    <ErrorField messages={valueError} />
    <PrimaryButton onclick={() => onButtonClick()} type="green" label={validateLabel} isLoading={fakeLoading} />
  </div>
</div>

<style lang="scss">
  .calibration-input-container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 24px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }

  .value {
    font-size: var(--font-L);
    font-weight: bold;
  }

  .unit {
    margin-bottom: 4px;
  }
</style>

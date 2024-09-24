<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';

  interface Props {
    calibrationTable: CalibrationTable;
    onValidate: () => void;
  }

  const { calibrationTable, onValidate }: Props = $props();
  const { min, max, label, validateLabel } = calibrationTable;
  const id = `calibration_input_${label}`;

  let value = $state<number | null>(null);
</script>

<div class="calibration-input-container">
  <div class="input-row">
    <label for={id}>{label}</label>
    <input type="number" bind:value {min} {max} />
  </div>
  <PrimaryButton onclick={onValidate} type="green" label={validateLabel} />
</div>

<style lang="scss">
  .calibration-input-container {
    width: 60%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 16px;
  }

  .input-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
</style>

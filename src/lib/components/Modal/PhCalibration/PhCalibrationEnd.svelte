<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import type { CalibrationTable } from '$lib/types';

  interface Props {
    calibrationTables: Array<CalibrationTable>;
    stepValues: Array<number | null>;
    isLoading: boolean;
    onValidate: () => void;
  }

  const { calibrationTables, stepValues, onValidate, isLoading }: Props = $props();

  function onValidateCalibration() {
    console.log('Validating calibration');
    onValidate();
  }
</script>

<div class="ph-calibration-end-container">
  <div class="end-content">
    <span class="step-label">Calibrated values:</span>
    <div class="calibrated-values-container">
      <div class="calibrated-values">
        {#each calibrationTables as table, index (table.label)}
          <div class="calibrated-value">
            <span>{table.label} → </span>
            <span>{stepValues[index]} {table.unit}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="button-container">
    <PrimaryButton onclick={() => onValidateCalibration()} type="green" label="Validate calibration" {isLoading} />
  </div>
</div>

<style lang="scss">
  .ph-calibration-end-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    max-width: 80%;
  }

  .end-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    padding: 24px;
    background-color: var(--primary-lighter);
    border-radius: var(--radius-XL);
    border: 1px solid var(--secondary-lighter);
  }

  .step-label {
    font-size: var(--font-ML);
    margin-bottom: 16px;
  }

  .warning-span {
    color: var(--warning);
    background-color: var(--warning-lighter);

    padding: 8px 16px;
    border-radius: var(--radius-S);
    font-weight: bold;
  }

  .list-item {
    margin-bottom: 8px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }
</style>

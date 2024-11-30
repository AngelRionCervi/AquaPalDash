<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import ArrowRightIcon from '$lib/icons/arrow-right.svg?component';
  import type { CalibrationTable } from '$lib/types';

  interface Props {
    calibrationTables: Array<CalibrationTable>;
    stepValues: Array<number | null>;
    onValidate: () => void;
  }

  const { calibrationTables, stepValues, onValidate, isLoading }: Props = $props();
</script>

<div class="ph-calibration-end-container">
  <div class="end-content">
    <span class="step-label">Calibrated values:</span>
    {#each calibrationTables as table, index (table.label)}
      <div class="calibrated-value">
        <span class="label">{table.label}</span>
        <ArrowRightIcon width="24" height="24" />
        <div class="value-and-unit">
          <span class="value">{stepValues[index]}</span>
          <span class="unit">{table.unit}</span>
        </div>
      </div>
    {/each}
  </div>
  <div class="button-container">
    <PrimaryButton onclick={() => onValidate()} type="green" label="Validate and restart" {isLoading} />
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

  .button-container {
    display: flex;
    justify-content: center;
  }

  .calibrated-value {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .value-and-unit {
    display: flex;
    align-items: flex-end;
    gap: 4px;
  }

  .unit {
    margin-bottom: 1px;
  }

  .label,
  .value {
    font-size: var(--font-ML);
    font-weight: bold;
  }
</style>

<script lang="ts">
  import CalibrationInput from '$lib/components/Inputs/CalibrationInput.svelte';
  import type { CalibrationTable } from '$lib/types';

  interface Props {
    calibrationTable: CalibrationTable;
    onValidate: (value: number | null) => void;
  }

  const { calibrationTable, onValidate }: Props = $props();
</script>

<div class="ph-calibration-step-container">
  <div class="step-content">
    <span class="step-label">{calibrationTable.label} Calibration</span>
    <ul>
      {#each calibrationTable.steplabels as stepLabel, index (stepLabel)}
        <li class="list-item">{index + 1}. {stepLabel}</li>
      {/each}
    </ul>
  </div>
  <CalibrationInput {calibrationTable} {onValidate} />
</div>

<style lang="scss">
  .ph-calibration-step-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    max-width: 80%;
  }

  .step-label {
    font-size: var(--font-ML);
    margin-bottom: 16px;
  }

  .list-item {
    margin-bottom: 8px;
  }

  .step-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    padding: 24px;
    background-color: var(--primary-lighter);
    border-radius: var(--radius-XL);
    border: 1px solid var(--secondary-lighter);
  }
</style>

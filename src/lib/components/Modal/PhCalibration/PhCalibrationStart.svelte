<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import type { CalibrationTable } from '$lib/types';

  interface Props {
    onValidate: () => void;
  }

  const { onValidate }: Props = $props();
</script>

<div class="ph-calibration-start-container">
  <div class="start-content">
    <span class="step-label">PH calibration instructions</span>
    <ul>
      <li class="list-item">1. Get a calibration solution of PH 4 and PH 7.</li>
      <li class="list-item">2. Validate the millivolt reading for the solution of PH 4 and then for the solution of PH 7.</li>
    </ul>
    <span class="warning-span">Make sure the readings stabilizes for a few seconds before validating.</span>
  </div>
  <div class="button-container">
    <PrimaryButton onclick={() => onValidate()} type="green" label="Start calibration" />
  </div>
</div>

<style lang="scss">
  .ph-calibration-start-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    max-width: 80%;
  }

  .start-content {
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

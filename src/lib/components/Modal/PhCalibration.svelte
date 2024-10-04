<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import CalibrationInput from '$lib/components/Inputs/CalibrationInput.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';

  const calibrationTables: Array<CalibrationTable> = [
    {
      label: 'PH 4:',
      validateLabel: 'Validate PH 4',
      type: 'ph',
      unit: 'Mv',
      min: 0
    },
    {
      label: 'PH 7:',
      validateLabel: 'Validate PH 7',
      type: 'ph',
      unit: 'Mv',
      min: 0
    }
  ];

  let step = $state<number>(0);
  let stepValues = $state<Array<number | null>>(new Array(calibrationTables.length).fill(0));
  let calibrationTable = $derived<CalibrationTable>(calibrationTables[step]);
  let valueError = $state<string>('');

  function onValidateStep(newValue: number | null) {
    if (step < 2) {
      stepValues[step] = newValue;
      step++;
    } else {
      modalStore.toggle();
      console.log('PH calibration completed');
    }
    
    console.log('Validating step', step);
  }

  function onValidateCalibration() {
    console.log('Validating calibration', stepValues);
  }
</script>

<div class="ph-calibration-container">
  {#if step < 2}
    <CalibrationInput {calibrationTable} onValidate={onValidateStep} />
  {:else}
    <span class="step-label">Calibrated values:</span>
    <div class="calibrated-values-container">
      <div class="calibrated-values">
        {#each calibrationTables as table, index}
          <div class="calibrated-value">
            <span>{table.label}</span>
            <span>{stepValues[index]} {table.unit}</span>
          </div>
        {/each}
      </div>
    </div>
    <div class="button-container">
      <PrimaryButton onclick={() => onValidateCalibration()} type="green" label="Validate calibration" />
    </div>
  {/if}
</div>

<style lang="scss">
  .ph-calibration-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
    align-items: center;
  }

  .step-label {
    font-size: var(--font-ML);
  }
</style>

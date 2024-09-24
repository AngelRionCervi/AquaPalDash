<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import CalibrationInput from '$lib/components/Inputs/CalibrationInput.svelte';

  let step = $state(0);
  
  const calibrationTable = $derived.by<CalibrationTable>(() => {
    return {
      label: step === 0 ? 'PH 4' : 'PH 7',
      validateLabel: `Validate PH ${step === 0 ? 4 : 7}`,
      type: 'ph',
      min: 0,
      max: 14
    };
  });

  function onValidateStep() {
    console.log('Validating step', step);
  }
</script>

<div class="ph-calibration-container">
  <CalibrationInput {calibrationTable} onValidate={onValidateStep} />
</div>

<style lang="scss">
  .ph-calibration-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
  }
</style>

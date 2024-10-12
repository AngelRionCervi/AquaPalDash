<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import modalStore from '$lib/stores/modalStore.svelte';
  import PhCalibrationEnd from './PhCalibrationEnd.svelte';
  import PhCalibrationStart from './PhCalibrationStart.svelte';
  import PhCalibrationStep from './PhCalibrationStep.svelte';
  import monitoringStore from '$lib/stores/monitoringStore.svelte';
  import { onMount } from 'svelte';

  const calibrationTables: Array<CalibrationTable> = [
    {
      label: 'PH 4',
      validateLabel: 'Validate PH 4',
      steplabels: ['Dip the probe in the calibration solution of PH4.', 'Wait for the millivolt reading to stabilize.', 'Press validate.'],
      type: 'ph',
      unit: 'Mv',
      min: 0
    },
    {
      label: 'PH 7',
      validateLabel: 'Validate PH 7',
      steplabels: ['Dip the probe in the calibration solution of PH7.', 'Wait for the millivolt reading to stabilize.', 'Press validate.'],
      type: 'ph',
      unit: 'Mv',
      min: 0
    }
  ];

  let step = $state<number>(0);
  let stepValues = $state<Array<number | null>>([]);

  function onValidateStep(newValue: number | null) {
    if (step > 0 && step < 3) {
      if (step === 1) {
        stepValues[0] = newValue;
      } else if (step === 2) {
        stepValues[1] = newValue;
      }
    }
    if (step < 3) {
      step++;
    } else {
      modalStore.toggle();
      console.log('PH calibration completed');
    }

    console.log('Validating step', step, stepValues);
  }

  function onValidateCalibration() {
    console.log('Validating calibration', stepValues);
    monitoringStore.setLoading('phCalibration', true);

    if (!modalStore.childProps) return;
    modalStore.childProps.backButtonHandler = null;

    // FOR DEV PURPOSE
    setTimeout(() => {
      monitoringStore.setLoading('phCalibration', false);
      monitoringStore.endPhCalibration();
      modalStore.toggle();
    }, 2000);
  }

  function onValidateStart() {
    console.log('Starting calibration');
    step++;
  }

  function onBackButtonClick() {
    if (step > 0) {
      step--;
    }
  }

  $effect(() => {
    if (!modalStore.childProps) return;
    if (step > 0) {
      modalStore.childProps.backButtonHandler = () => onBackButtonClick();
    } else {
      modalStore.childProps.backButtonHandler = null;
    }
  });

  onMount(() => {
    monitoringStore.startPhCalibration();

    return () => {
      monitoringStore.endPhCalibration();
    };
  });
</script>

<div class="ph-calibration-container">
  {#if step === 0}
    <PhCalibrationStart onValidate={onValidateStart} />
  {:else if step > 0 && step < 3}
    <PhCalibrationStep
      calibrationTable={step === 1 ? structuredClone(calibrationTables[0]) : structuredClone(calibrationTables[1])}
      onValidate={onValidateStep}
    />
  {:else if step === 3}
    <PhCalibrationEnd {calibrationTables} {stepValues} onValidate={onValidateCalibration} isLoading={monitoringStore.loadings.phCalibration} />
  {/if}
</div>

<style lang="scss">
  @import '$lib/variables.scss';

  .ph-calibration-container {
    width: 650px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: $small-mobile-bp) {
      width: 350px;
    }
  }

  .step-label {
    font-size: var(--font-ML);
  }
</style>

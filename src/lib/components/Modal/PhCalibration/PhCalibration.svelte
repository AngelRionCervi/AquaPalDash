<script lang="ts">
  import type { CalibrationTable } from '$lib/types';
  import modalStore from '$lib/stores/modalStore.svelte';
  import PhCalibrationEnd from './PhCalibrationEnd.svelte';
  import PhCalibrationStart from './PhCalibrationStart.svelte';
  import PhCalibrationStep from './PhCalibrationStep.svelte';
  import monitoringStore from '$lib/stores/monitoringStore.svelte';
  import { onMount } from 'svelte';
  import configStore from '$lib/stores/configStore.svelte';

  const calibrationTables: Array<CalibrationTable> = [
    {
      label: 'PH 4',
      validateLabel: 'Validate PH 4',
      steplabels: ['Dip the probe in the calibration solution of PH 4.', 'Wait for the millivolt reading to stabilize.', 'Press validate.'],
      type: 'ph',
      unit: 'Mv',
      min: 0
    },
    {
      label: 'PH 7',
      validateLabel: 'Validate PH 7',
      steplabels: ['Dip the probe in the calibration solution of PH 7.', 'Wait for the millivolt reading to stabilize.', 'Press validate.'],
      type: 'ph',
      unit: 'Mv',
      min: 0
    }
  ];

  let step = $state<number>(0);
  let stepValues = $state<[number, number]>([0, 0]);

  function onValidateStep(newValue: number | null) {
    if (step > 0 && step < 3) {
      if (step === 1) {
        stepValues[0] = newValue || 0;
      } else if (step === 2) {
        stepValues[1] = newValue || 0;
      }
    }
    if (step < 3) {
      step++;
    } else {
      modalStore.toggle();
    }
  }

  function onValidateCalibration() {
    if (!modalStore.childProps) return;
    modalStore.childProps.backButtonHandler = null;

    monitoringStore.endPhCalibration();
    configStore.updateSetting('phCalibration', { ph4Mv: stepValues[0], ph7Mv: stepValues[1] });
    configStore.uploadNewConfig();
    modalStore.toggle();
  }

  function onValidateStart() {
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
    <PhCalibrationEnd {calibrationTables} {stepValues} onValidate={onValidateCalibration} />
  {/if}
</div>

<style lang="scss">
  @use '$lib/variables.scss';

  .ph-calibration-container {
    width: 650px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: variables.$small-mobile-bp) {
      width: 350px;
    }
  }
</style>

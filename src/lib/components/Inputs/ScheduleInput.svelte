<script lang="ts">
  import { getScheduleLabel } from '$lib/helpers/utils';
  import DoubleRangeSlider from '$lib/components/Inputs/DoubleRangeSlider.svelte';
  import scheduleRadioTypes from '$lib/data/scheduleSettings';

  interface Props {
    onChange: (schedule: Schedule) => void;
    previousSetting?: Schedule;
    timeFormat?: '12h' | '24h';
  }

  const { onChange, previousSetting, timeFormat = '24h' }: Props = $props();

  const min = 0;
  const max = 24 * 60; // 1 day in minutes
  const step = 15;
  const defaultMin = 11 * 60; // 11h
  const defaultMax = 18 * 60; // 18h

  let scheduleType = $state(
    Array.isArray(previousSetting) ? 'range' : typeof previousSetting === 'boolean' ? (previousSetting ? 'alwaysOn' : 'alwaysOff') : null
  );
  let minMins = $state(0);
  let maxMins = $state(0);

  function onRangeChange({ min, max }: { min: number; max: number }) {
    minMins = min;
    maxMins = max;
    sendChange();
  }

  function onRadioTypeChange(value: string) {
    scheduleType = value;
    sendChange();
  }

  function sendChange() {
    if (scheduleType === 'alwaysOn') {
      onChange(true);
    } else if (scheduleType === 'alwaysOff') {
      onChange(false);
    } else {
      onChange([minMins, maxMins]);
    }
  }
</script>

<div class="main-container">
  <div class="radio-schedule-type">
    <fieldset class="radio-schedule-type-inner">
      {#each scheduleRadioTypes as { id, name, value, label } (id)}
        <div class="input-row">
          <input class="radio-input" type="radio" {id} {name} {value} checked={scheduleType === value} onchange={() => onRadioTypeChange(value)} />
          <label for={id}>{label}</label>
        </div>
      {/each}
    </fieldset>
  </div>
  {#if scheduleType === 'range'}
    <div class="slider-container">
      <DoubleRangeSlider
        {min}
        {max}
        {step}
        defaultMin={Array.isArray(previousSetting) ? previousSetting[0] : defaultMin}
        defaultMax={Array.isArray(previousSetting) ? previousSetting[1] : defaultMax}
        onchange={onRangeChange}
      />
      <div class="new-schedule">
        <p>{@html getScheduleLabel([minMins, maxMins], timeFormat)}</p>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .main-container {
    width: 100%;
  }

  .radio-schedule-type {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .radio-schedule-type-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .slider-container {
    width: 100%;
    margin-top: 24px;
  }

  .new-schedule {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .radio-input {
    &:checked {
      border: 6px solid var(--primary-success);
    }
  }
</style>

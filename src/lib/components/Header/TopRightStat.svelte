<script lang="ts">
  import { celsiusToFahrenheit, randomDecimal } from '$lib/helpers/utils';
  import authStore from '$lib/stores/authStore.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import monitoringStore, { type MonitoringValueParam } from '$lib/stores/monitoringStore.svelte';

  interface Props {
    stat: MonitoringValueParam;
  }

  const { stat }: Props = $props();

  const statLabelMap = {
    ph: 'PH:',
    temp: 'Temp:'
  };

  const isError = $derived(monitoringStore.errors[stat]);
  const statValue = $derived(isError ? '-' : getCorrectValue(monitoringStore.last[stat], stat));

  function getRandomDecimal(label: MonitoringValueParam) {
    if (label === 'ph') {
      return randomDecimal(6, 7.5, 2);
    } else {
      return randomDecimal(22, 25, 2);
    }
  }

  function getUnit() {
    const unit = configStore.config?.settings?.tempUnit;
    const tempUnit = unit === 'fahrenheit' ? '°F' : '°C';
    return stat === 'ph' ? '' : tempUnit;
  }

  function getCorrectValue(value: number, stat: string) {
    if (stat === 'ph') return value;

    const unit = configStore.config?.settings?.tempUnit;
    if (unit === 'fahrenheit') {
      return celsiusToFahrenheit(value);
    }
    return value;
  }
</script>

<div class="container">
  <div class="label">
    <span>{statLabelMap[stat]}</span>
  </div>
  <div class="value value-{isError ? 'ko' : 'ok'}">
    <span class="value-label"
      >{authStore.isDemoMode ? getRandomDecimal(stat) : statValue}
      <p class="stat-unit">{getUnit()}</p>
    </span>
  </div>
</div>

<style lang="scss">
  .container {
    display: flex;
    gap: 8px;
  }

  .value {
    font-size: var(--font-XL);
    font-weight: bold;

    &.value-ok {
      color: var(--primary-success);
    }

    &.value-ko {
      color: var(--secondary);
    }
  }

  .stat-unit {
    display: inline-block;
    margin-left: 8px;
    font-size: var(--font-ML);
  }

  .value-label {
    display: flex;
    align-items: flex-start;
  }
</style>

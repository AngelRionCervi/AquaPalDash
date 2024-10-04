<script lang="ts">
  import { onMount } from 'svelte';
  import { convertToChartData } from '$lib/helpers/charts';
  import monitoringStore from '$lib/stores/monitoringStore.svelte';
  import LineChart from '$lib/components/Charts/LineChart.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import authStore from '$lib/stores/authStore.svelte';
  import TopRightStat from '$lib/components/Header/TopRightStat.svelte';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';

  const chartData = $derived(
    convertToChartData(monitoringStore.historicals, {
      tempUnit: configStore.config?.settings?.tempUnit,
      timeFormat: configStore.config?.settings?.timeFormat
    })
  );

  function getCorrectTempUnit() {
    const unit = configStore.config?.settings?.tempUnit;
    return unit === 'fahrenheit' ? '°F' : '°C';
  }

  function onCalibratePh() {
    console.log("entering ph calibration");
    modalStore.toggle('phCalibration');
  }

  onMount(() => {
    // FOR DEVELOPMENT PURPOSES
    monitoringStore.loadMockData();
    return;


    const { enableMonitoring } = configStore.config?.settings || {};
    if (!enableMonitoring) return;

    if (authStore.isDemoMode) {
      monitoringStore.loadMockData();
      return;
    }

    if (!monitoringStore.historicals.length && monitoringStore.hFlow === 'idle') {
      monitoringStore.queryHistorical();
    }

    monitoringStore.queryLast();
  });
</script>

<div class="monitoring-main-container">
  {#if configStore.config?.settings.enableMonitoring}
    <div class="mobile-quick-view">
      <TopRightStat stat="temp" />
      <TopRightStat stat="ph" />
    </div>
    <PrimaryButton type="default" label="Calibrate PH" onclick={onCalibratePh} />
    <div class="data-container">
      <div class="chart-container">
        <LineChart
          data={chartData?.temp || { series: [] }}
          isLoading={monitoringStore.hFlow === 'stream'}
          title="Temperature ({getCorrectTempUnit()})"
        />
      </div>
      <div class="chart-container">
        <LineChart data={chartData?.ph || { series: [] }} isLoading={monitoringStore.hFlow === 'stream'} title="PH" />
      </div>
    </div>
  {:else}
    <span>Monitoring is disabled.</span>
    <br />
    <span>Make sure you have plugged in a temp and/or a ph sensor, then enable monitoring in settings tab</span>
  {/if}
</div>

<style lang="scss">
  @import '$lib/variables.scss';

  .monitoring-main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-bottom: 32px;
  }

  .data-container {
    display: flex;
    gap: 32px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 32px;
    width: 100%;
    justify-content: space-between;
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    width: 85%;
    
    @media screen and (max-width: $mobile-bp) {
      width: 95%;
    }
  }

  .mobile-quick-view {
    display: none;
    justify-content: space-evenly;
    margin: 16px;

    @media screen and (max-width: $mobile-bp) {
      display: flex;
    }
  }
</style>

<script lang="ts">
  import { getCSSvar } from '$lib/helpers/utils';
  import { onMount } from 'svelte';
  import Loader from '$lib/components/Loaders/Loader.svelte';

  interface Props {
    data: any;
    isLoading: boolean;
    title: string;
  }

  const { data, isLoading, title }: Props = $props();

  let chart = $state<null | ApexCharts>(null);
  let chartEl: HTMLDivElement;
  let lastZoom: [number, number] | null = null;

  const options = {
    chart: {
      height: 380,
      width: '100%',
      type: 'line',
      animations: {
        enabled: false
      },
      events: {
        beforeResetZoom: () => {
          lastZoom = null;
        },
        zoomed: (_: any, value: any) => {
          lastZoom = [value.xaxis.min, value.xaxis.max];
        }
      },
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
          customIcons: []
        }
      }
    },
    stroke: {
      show: true,
      curve: 'straight',
      lineCap: 'butt',
      colors: [],
      width: 4,
      dashArray: 0
    }
  };

  $effect(() => {
    if (!chart) return;
    chart.updateSeries(data.series);
    if (lastZoom) {
      chart.zoomX(lastZoom[0], lastZoom[1]);
    }
  });

  onMount(async () => {
    const ApexCharts = (await import('apexcharts')).default;
    (options.stroke.colors as any) = [getCSSvar('--primary-success')];
    chart = new ApexCharts(chartEl, { ...data, ...options });
    chart.render();
  });
</script>

<div class="chart-title-container">
  <h3 class="chart-title">{title}</h3>
  <div class="loading-container" class:is-loading-visible={isLoading}>
    <Loader theme="dark" size="big" />
  </div>
  <div class="chart" class:is-chart-visible={!isLoading} bind:this={chartEl}></div>
</div>

<style lang="scss">
  @import '$lib/variables.scss';

  .chart-title-container {
    padding: 16px;
    border-radius: var(--radius-XL);
    border: 1px dashed var(--secondary-lighter);
    min-height: 380px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: $mobile-bp) {
      padding: 12px;
    }
  }

  .chart {
    width: 100%;
    height: 100%;
    display: none;

    &.is-chart-visible {
      display: block;
    }
  }

  .loading-container {
    display: none;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex: 1;

    &.is-loading-visible {
      display: flex;
    }
  }

  .chart-title {
    margin-left: 32px;
    font-size: var(--font-ML);

    @media screen and (max-width: $mobile-bp) {
      margin: 16px;
    }
  }
</style>

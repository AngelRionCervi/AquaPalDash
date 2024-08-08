<script lang="ts">
	import { onMount } from 'svelte';
	import { convertToChartData } from '$lib/helpers/charts';
	import monitoringStore from '$lib/stores/monitoringStore.svelte';
	import LineChart from '$lib/components/Charts/LineChart.svelte';
	import configStore from '$lib/stores/configStore.svelte';
  import authStore from '$lib/stores/authStore.svelte';

	const chartData = $derived(convertToChartData(monitoringStore.historicals));

	onMount(async () => {
		const { enableMonitoring } = configStore.config?.settings || {};
		if (!enableMonitoring) return;

    if (authStore.isDemoMode) {
      monitoringStore.loadMockData();
      return;
    }

		if (!monitoringStore.historicals.length) {
			await monitoringStore.fetchHistoricals();
		}
		if (!monitoringStore.updateInterval) {
			monitoringStore.updateLastWithInterval();
		}
		await monitoringStore.updateLast();
	});
</script>

<div class="monitoring-main-container">
	{#if configStore.config?.settings.enableMonitoring}
		<div class="data-container top">
			<div class="chart-container">
				<h3 class="chart-title">Temperature (C°)</h3>
				<LineChart data={chartData?.temp || { series: [] }} />
			</div>
			<div class="chart-container">
				<h3 class="chart-title">PH</h3>
				<LineChart data={chartData?.ph || { series: [] }} />
			</div>
		</div>
	{:else}
		<span>Monitoring is disabled.</span>
		<br />
		<span
			>Make sure you have plugged in a temp and/or a ph sensor, then enable monitoring in settings
			tab</span
		>
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

		&.top {
			gap: 16px;
			width: 100%;
			justify-content: space-between;
		}

		@media screen and (max-width: $mobile-bp) {
			flex-direction: column;
		}
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		width: 45vw;

		h3 {
			margin-left: 32px;
		}

    @media screen and (max-width: $mobile-bp) {
			width: 90vw;
		}
	}

  .chart-title {
    margin-left: 32px;

    @media screen and (max-width: $mobile-bp) {
			margin: 16px;
		}
  }
</style>

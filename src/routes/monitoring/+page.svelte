<script lang="ts">
	import { onMount } from 'svelte';
	import { convertToChartData } from '$lib/helpers/charts';
	import monitoringStore from '$lib/stores/monitoringStore.svelte';
	import LineChart from '$lib/components/Charts/LineChart.svelte';
	import configStore from '$lib/stores/configStore.svelte';

	const chartData = $derived(convertToChartData(monitoringStore.historicals));

	onMount(async () => {
		const { enableMonitoring } = configStore.config?.settings || {};
		if (!enableMonitoring) return;

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
			<h3>Temperature (C°)</h3>
			<LineChart data={chartData?.temp || { series: [] }} />
		</div>
		<div class="chart-container">
			<h3>PH</h3>
			<LineChart data={chartData?.ph || { series: [] }} />
		</div>
	</div>
  {:else}
    <span>Monitoring is disabled.</span>
    <br>
    <span>Make sure you have plugged in a temp and/or a ph sensor, then enable monitoring in settings tab</span>
  {/if}
</div>

<style lang="scss">
	.monitoring-main-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.data-container {
		display: flex;

		&.top {
			gap: 16px;
			width: 100%;
			justify-content: space-between;
		}
	}

	.chart-container {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 45vw;

		h3 {
			margin-left: 32px;
		}
	}
</style>

<script lang="ts">
	import { getChartData } from '$lib/helpers/charts';
	import monitoringStore from '$lib/stores/monitoringStore.svelte';
	import LineChart from '$lib/components/Charts/LineChart.svelte';

	const chartData = $state(getChartData(monitoringStore.historicals));
</script>

<div class="monitoring-main-container">
	<div class="data-container top">
		<div class="chart-container">
      <h3>Temperature (C°)</h3>
			<LineChart data={chartData.temp} />
		</div>
		<div class="chart-container">
      <h3>PH</h3>
			<LineChart data={chartData.ph} />
		</div>
	</div>
	<div class="data-container bottom"></div>
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

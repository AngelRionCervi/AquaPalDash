<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		data: any;
	}

	const { data }: Props = $props();

	let chartEl: HTMLDivElement;

	const options = {
		chart: {
			height: 380,
			width: '100%',
			type: 'line'
		}
	};

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;
		const chart = new ApexCharts(chartEl, { ...options, ...data });
		chart.render();
	});
</script>

<div class="chart" bind:this={chartEl}></div>

<style lang="scss">
  .chart {
    width: 100%;
    height: 100%;
  }
</style>

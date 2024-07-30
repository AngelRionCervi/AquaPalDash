<script lang="ts">
	import { getCSSvar } from '$lib/helpers/utils';
	import { onMount } from 'svelte';

	interface Props {
		data: any;
	}

	const { data }: Props = $props();

	let chart = $state<null | ApexCharts>(null);
	let chartEl: HTMLDivElement;

	const options = {
		chart: {
			height: 380,
			width: '100%',
			type: 'line',
			animations: {
				enabled: false
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
	});

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;
		(options.stroke.colors as any) = [getCSSvar('--primary-success')];
    console.log('getCSSvar', getCSSvar('--primary-success'))
		chart = new ApexCharts(chartEl, { ...data, ...options });
		console.log('chart data', { ...data, ...options });
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

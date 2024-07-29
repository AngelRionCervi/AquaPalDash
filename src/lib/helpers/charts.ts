import type { MonitoringPayload } from "$lib/stores/monitoringStore.svelte";

export function getChartData(data: MonitoringPayload[]) {
	const chartDataPh = {
		series: [{ name: 'PH', data: data.map((d) => [d.ph, d.timestamp]) }],
		xaxis: {
			type: 'numeric'
		}
	};

	const chartDataTemp = {
		series: [{ name: 'PH', data: data.map((d) => [d.temp, d.timestamp]) }],
		xaxis: {
			type: 'numeric'
		}
	};

	return { ph: chartDataPh, temp: chartDataTemp };
}

import type { MonitoringPayload } from '$lib/stores/monitoringStore.svelte';

export function getChartData(data: MonitoringPayload[]) {
	const dateFormat = 'dd MMM HH:mm';
  
	const chartDataPh = {
		series: [{ name: 'PH', data: data.map((d) => ({ y: d.ph, x: d.timestamp * 1000 })) }],
		xaxis: {
			type: 'datetime',
			labels: {
				format: dateFormat
			}
		}
	};

	const chartDataTemp = {
		series: [{ name: 'PH', data: data.map((d) => ({ y: d.temp, x: d.timestamp * 1000 })) }],
		xaxis: {
			type: 'datetime',
			labels: {
				format: dateFormat
			}
		}
	};

	console.log('chartDataPh', chartDataPh);

	return { ph: chartDataPh, temp: chartDataTemp };
}

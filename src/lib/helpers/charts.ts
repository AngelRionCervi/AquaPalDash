import type { MonitoringPayload } from '$lib/stores/monitoringStore.svelte';
import { roundTo } from './utils';

export function convertToChartData(data: MonitoringPayload[]) {
	const dateFormat = 'dd MMM HH:mm';

	const chartDataPh = {
		series: [
			{ name: 'PH', data: data.map((d) => ({ y: roundTo(d.ph, 1), x: d.timestamp * 1000 })) }
		],
		xaxis: {
			type: 'datetime',
			labels: {
				format: dateFormat
			}
		},
	};

	const chartDataTemp = {
		series: [
			{ name: 'PH', data: data.map((d) => ({ y: roundTo(d.temp, 2), x: d.timestamp * 1000 })) }
		],
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

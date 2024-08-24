import type { MonitoringPayload } from '$lib/stores/monitoringStore.svelte';
import { randomDecimal, roundTo } from './utils';

export function convertToChartData(data: MonitoringPayload[]) {
	const dateFormat = 'dd MMM';

	const chartDataPh = {
		series: [
			{ name: 'PH', data: data.map((d) => ({ y: roundTo(d.ph, 1), x: d.timestamp * 1000 })) }
		],
		xaxis: {
			type: 'datetime',
			labels: {
				format: dateFormat
			}
		}
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

	return { ph: chartDataPh, temp: chartDataTemp };
}

export function generateMockData() {
	const data = [];
	const start = new Date().getTime();
	for (let i = 0; i < 100; i++) {
		data.push({
			temp: randomDecimal(22, 25, 2),
			ph: randomDecimal(6, 7.5, 2),
			timestamp: start - i
		});
	}

	return data;
}

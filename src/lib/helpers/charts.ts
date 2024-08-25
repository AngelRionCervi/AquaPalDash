import type { MonitoringPayload } from '$lib/stores/monitoringStore.svelte';
import { celsiusToFahrenheit, randomDecimal, roundTo } from './utils';

export function convertToChartData(data: MonitoringPayload[], options: Record<string, unknown> = {}) {
  const datetimeFormatter = {
    year: 'yyyy',
    month: 'MMM \'yy',
    day: 'dd MMM',
    hour: 'HH:mm'
  }

  function getCorrectedTempValue(value: number) {
    if (options.tempUnit === 'fahrenheit') {
      return celsiusToFahrenheit(value);
    }

    return value;
  }

  const chartDataPh = {
    series: [{ name: 'PH', data: data.map((d) => ({ y: roundTo(d.ph, 1), x: d.timestamp * 1000 })) }],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter
      }
    }
  };

  const chartDataTemp = {
    series: [{ name: 'PH', data: data.map((d) => ({ y: getCorrectedTempValue(roundTo(d.temp, 2)), x: d.timestamp * 1000 })) }],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter
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

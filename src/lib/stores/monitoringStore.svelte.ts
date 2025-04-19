import { DEFAULT_HISTORICAL_DAYS } from '$lib/constants';
import { generateMockData } from '$lib/helpers/charts';
import { roundTo } from '$lib/helpers/utils';
import { sendWSMessage } from '$lib/wsClient/WSClientHandler';
import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';

export type MonitoringValueParam = 'ph' | 'temp';

export interface MonitoringPayload {
  temp: number;
  ph: number;
  timestamp: number;
}

export interface RawMonitoringPayload {
  t: number;
  p: number;
  d: number;
}

export interface LiveMonitoringPayload {
  ph: number;
  temp: number;
}

interface MonitoringLast {
  ph: number;
  temp: number;
}

type ValueError = null | string;

interface MonitoringError {
  ph: ValueError;
  temp: ValueError;
}

interface MonitoringLoadings {
  completePhCalibration: boolean;
}

interface MonitoringState {
  last: MonitoringLast;
  historicals: MonitoringPayload[];
  errors: MonitoringError;
  lastUpdate: number;
  loadings: MonitoringLoadings;
  phMv: number;
  hFlow: 'idle' | 'stream';
}

type HistoricalDataFlow = 'start' | 'end' | 'stream';

interface MonitoringStore {
  last: MonitoringLast;
  historicals: MonitoringPayload[];
  errors: MonitoringError;
  lastUpdate: number;
  hFlow: 'idle' | 'stream';
  loadings: MonitoringLoadings;
  phMv: number;
  setPhMv: (value: number) => void;
  setError: (param: MonitoringValueParam, error: null | string) => void;
  checkError: (payload: MonitoringPayload) => boolean;
  updateHistoricalLast: (data: RawMonitoringPayload) => void;
  loadMockData: () => void;
  queryLast: () => void;
  queryHistorical: (totalDays?: number) => void;
  updateHistorical: (flow: HistoricalDataFlow, data: string) => void;
  updateLive: (data: LiveMonitoringPayload) => void;
  setLoading: (key: keyof MonitoringLoadings, value: boolean) => void;
  startPhCalibration: () => void;
  endPhCalibration: () => void;
}

const defaultMonitoringStoreValue: MonitoringState = {
  hFlow: 'idle',
  last: { ph: 0, temp: 0 },
  errors: { ph: null, temp: null },
  historicals: [],
  lastUpdate: 0,
  phMv: 0,
  loadings: {
    completePhCalibration: false
  }
};

const monitoringState = $state<MonitoringState>(defaultMonitoringStoreValue);

const monitoringStore: MonitoringStore = {
  get last() {
    return monitoringState.last;
  },
  get errors() {
    return monitoringState.errors;
  },
  get lastUpdate() {
    return monitoringState.lastUpdate;
  },
  get historicals() {
    return monitoringState.historicals;
  },
  get hFlow() {
    return monitoringState.hFlow;
  },
  get loadings() {
    return monitoringState.loadings;
  },
  get phMv() {
    return monitoringState.phMv;
  },
  setPhMv(value: number) {
    monitoringState.phMv = value;
  },
  setLoading(key: keyof MonitoringLoadings, bool: boolean) {
    monitoringState.loadings[key] = bool;
  },
  setError(param: MonitoringValueParam, error: null | string) {
    monitoringState.errors[param] = error;
  },
  checkError(payload: MonitoringPayload) {
    const { ph, temp } = payload;

    if (ph > 15 || ph <= 0) {
      monitoringState.errors.ph = 'Invalid PH value';
    } else {
      monitoringState.errors.ph = null;
    }

    if (temp > 50 || temp <= 0) {
      monitoringState.errors.temp = 'Invalid temperature value';
    } else {
      monitoringState.errors.temp = null;
    }

    return !!(monitoringState.errors.ph || monitoringState.errors.temp);
  },
  loadMockData() {
    monitoringState.historicals = generateMockData();
  },
  queryLast() {
    sendWSMessage({ type: DASH_CALL_TYPES.dash_monitoringGetLastType });
  },
  queryHistorical(pastDaysCount = DEFAULT_HISTORICAL_DAYS) {
    const historicalArg = getHistoricalDaysArg(pastDaysCount);
    sendWSMessage({ type: DASH_CALL_TYPES.dash_monitoringGetHistoricalType, data: historicalArg });
  },
  updateLive(data: LiveMonitoringPayload) {
    monitoringState.last = { ph: roundTo(data.ph, 1), temp: roundTo(data.temp, 2) };
    monitoringState.lastUpdate = Date.now();
  },
  updateHistoricalLast(data: RawMonitoringPayload) {
    const lastUpdate = getReadableMonitoring(data);
    monitoringStore.checkError(lastUpdate);

    monitoringState.last = { ph: roundTo(lastUpdate.ph, 1), temp: roundTo(lastUpdate.temp, 2) };
    monitoringState.lastUpdate = lastUpdate.timestamp;

    monitoringState.historicals = [...monitoringState.historicals, lastUpdate];
  },
  updateHistorical(flow: HistoricalDataFlow, data: string) {
    if (flow === 'start') {
      monitoringState.historicals = [];
      monitoringState.hFlow = 'stream';
      return;
    } else if (flow === 'end') {
      monitoringState.hFlow = 'idle';
      return;
    }
    if (flow !== 'stream') return;

    try {
      const parsedData = JSON.parse(`[${data.split('\n').join(',').slice(0, -1)}]`) as Array<RawMonitoringPayload>;
      const readableData = parsedData.map(getReadableMonitoring);

      monitoringState.historicals = [...readableData, ...monitoringState.historicals];
    } catch (err) {
      console.error('Error parsing historical data', err);
    }
  },
  startPhCalibration() {
    sendWSMessage({ type: DASH_CALL_TYPES.dash_setOnPhCalibrationType });
  },
  endPhCalibration() {
    monitoringStore.setLoading('completePhCalibration', false);
    sendWSMessage({ type: DASH_CALL_TYPES.dash_setOffPhCalibrationType });
  },
};

function getReadableMonitoring(payload: RawMonitoringPayload): MonitoringPayload {
  return { ph: payload.p, temp: payload.t, timestamp: payload.d };
}

function getHistoricalDaysArg(pastDaysCount: number) {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;

  function daysInMonth(month: number) {
    return new Date(new Date().getFullYear(), month, 0).getDate();
  }

  function processDay() {
    day--;

    if (day < 1) {
      month--;
      if (month < 1) {
        month = 12;
      }
      const daysInPrevMonth = daysInMonth(month);
      day = daysInPrevMonth;
    }
  }

  const pastDaysArray = Array.from({ length: pastDaysCount }, () => {
    processDay();
    return `${day + 1}_${month}`;
  });

  return pastDaysArray.join(',');
}

export default monitoringStore;

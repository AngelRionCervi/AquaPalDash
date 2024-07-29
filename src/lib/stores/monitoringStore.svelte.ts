import monitoringApi from '$lib/api/monitoringApi';
import { GET_MONITORING_UPDATE_INTERVAL, DEFAULT_HISTORICAL_DAYS } from '$lib/constants';

export type MonitoringValueParam = 'ph' | 'temp';

export interface MonitoringPayload {
	temp: number;
	ph: number;
	timestamp: number;
}

interface MonitoringLast {
	ph: number;
	temp: number;
}

interface RawMonitoringPayload {
	t: number;
	p: number;
	d: number;
}

type ValueError = null | string;

interface MonitoringError {
	ph: ValueError;
	temp: ValueError;
}

interface MonitoringState {
	last: MonitoringLast;
	historicals: MonitoringPayload[];
	errors: MonitoringError;
	lastUpdate: number;
	updateInterval: number;
}

interface MonitoringStore {
	last: MonitoringLast;
	historicals: MonitoringPayload[];
	errors: MonitoringError;
	lastUpdate: number;
	updateLastWithInterval: () => void;
	clearUpdateInterval: () => void;
	setError: (param: MonitoringValueParam, error: null | string) => void;
	checkError: (payload: MonitoringPayload) => boolean;
	updateLast: () => Promise<void>;
	fetchHistoricals: (pastDaysCount?: number) => Promise<void>;
}

const defaultMonitoringStoreValue: MonitoringState = {
	last: { ph: 0, temp: 0 },
	errors: { ph: null, temp: null },
	historicals: [],
	lastUpdate: 0,
	updateInterval: 0
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
	updateLastWithInterval() {
		monitoringState.updateInterval = setInterval(() => {
			monitoringStore.updateLast();
		}, GET_MONITORING_UPDATE_INTERVAL);
	},
	clearUpdateInterval() {
		clearInterval(monitoringState.updateInterval);
		monitoringState.updateInterval = 0;
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
	async updateLast() {
		const lastUpdate = getReadableMonitoring(await monitoringApi.API_getLastMonitoringData());

		const isError = monitoringStore.checkError(lastUpdate);

    console.log('LAST UPDTAE',lastUpdate, isError)

		//if (isError) return;

		monitoringState.last = { ph: lastUpdate.ph, temp: lastUpdate.temp };
		monitoringState.lastUpdate = lastUpdate.timestamp;

		monitoringState.historicals.push(lastUpdate);
	},
	async fetchHistoricals(pastDaysCount = DEFAULT_HISTORICAL_DAYS) {
		const historicalArg = getHistoricalDaysArg(pastDaysCount);
		const historicals = await monitoringApi.API_getHistoricalMonitoringData(historicalArg);

		monitoringState.historicals = historicals.map(getReadableMonitoring);
	}
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
		return `${day}_${month}`;
	});

	return pastDaysArray.join(',');
}

export default monitoringStore;

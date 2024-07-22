export function minutesToHours(mins: number) {
	const hours = mins / 60;
	const int = Math.floor(hours);
	const dec = (hours - int) * 60;

	return { hours: int, minutes: dec };
}

export function minsToReadableTime(mins: number) {
	const { hours, minutes } = minutesToHours(mins);

	return `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}`;
}

export function convertToType(valueType: string, value: string) {
	let typedValue: unknown = value;

	if (valueType === 'string') {
		typedValue = value.toString();
	} else if (valueType === 'number') {
		typedValue = parseInt(value);
	} else if (valueType === 'boolean') {
		typedValue = value === 'true';
	}

	return typedValue;
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getScheduleLabel(schedule: Schedule) {
	if (Array.isArray(schedule)) {
		return `On between <b>${minsToReadableTime(schedule[0])}</b> and <b>${minsToReadableTime(schedule[1])}</b>.`;
	} else if (typeof schedule === 'boolean') {
		return schedule ? 'Always on.' : 'Always off.';
	}

	return 'unknown';
}

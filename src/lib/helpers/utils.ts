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

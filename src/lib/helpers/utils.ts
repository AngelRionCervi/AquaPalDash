export function minutesToHours(mins: number) {
	const hours = mins / 60;
	const int = Math.floor(hours);
	const dec = (hours - int) * 60;

	return { hour: int, minutes: dec };
}

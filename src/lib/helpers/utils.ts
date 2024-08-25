import ShortUniqueId from 'short-unique-id';
const uuid = new ShortUniqueId({ length: 10 });

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

export function generateUniqueId() {
  return uuid.randomUUID();
}

export function roundTo(num: number, decimals: number) {
  const scale = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * scale) / scale;
}

export function getCSSvar(varName: string) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(varName);
}

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDecimal(min: number, max: number, dec: number) {
  return parseFloat(`${randomInteger(min, max - 1)}.${randomInteger(0, Math.pow(10, dec))}`);
}

export function celsiusToFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32;
}

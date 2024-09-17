import type { Schedule, ScheduleRangeLabels } from '$lib/types';
import ShortUniqueId from 'short-unique-id';
const uuid = new ShortUniqueId({ length: 10 });

export function minutesToHours(mins: number) {
  const hours = mins / 60;
  const int = Math.floor(hours);
  const dec = (hours - int) * 60;

  return { hours: int, minutes: dec };
}

export function convertFrom24To12Format(time24: number, minutes: number) {
  const period = time24 < 12 ? 'AM' : 'PM';
  const hours = time24 % 12 || 12;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function minsToReadableTime(mins: number, timeFormat: '24h' | '12h' = '24h') {
  const { hours, minutes } = minutesToHours(mins);

  if (timeFormat === '24h') {
    return `${hours.toString().padStart(2, '0')}h${minutes.toString().padStart(2, '0')}`;
  }

  return `${convertFrom24To12Format(hours, minutes)}`;
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

export function getScheduleLabel(schedule: Schedule, timeFormat: '24h' | '12h' = '24h'): string | ScheduleRangeLabels {
  if (Array.isArray(schedule)) {
    return [minsToReadableTime(schedule[0], timeFormat), minsToReadableTime(schedule[1], timeFormat) ];
  } else if (typeof schedule === 'boolean') {
    return schedule ? 'Always on' : 'Always off';
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

import type { Setting } from '$lib/components/Settings/type';

const settings: Array<Setting> = [
	{
		name: 'autoSchedulesOnAfter',
		label: 'Schedule auto turn on after:',
		defaultVal: 30,
		type: 'select',
    valueType: 'number',
		values: [
			{ label: '5 mins', value: 5 },
			{ label: '10 mins', value: 10 },
			{ label: '15 mins', value: 15 },
			{ label: '30 mins', value: 30 },
			{ label: '1 hour', value: 60 },
			{ label: '2 hours', value: 120 }
		]
	},
	{
		name: 'theme',
		label: 'Theme:',
		defaultVal: 'light',
		type: 'select',
    valueType: 'string',
		values: [
			{ label: 'light', value: 'light' },
			{ label: 'dark', value: 'dark' }
		]
	},
	{
		name: 'tempUnit',
		label: 'Temperature unit:',
		defaultVal: 'celsius',
		type: 'select',
    valueType: 'string',
		values: [
			{ label: 'celsius', value: 'celsius' },
			{ label: 'fahrenheit', value: 'fahrenheit' }
		]
	},
	{
		name: 'aquariumLabel',
		label: 'Aquarium label:',
		defaultVal: 'Main aquarium',
    valueType: 'string',
		type: 'text'
	},
	{
		name: 'prefetchHistorical',
		label: 'Prefetch historical sensors data:',
    valueType: 'boolean',
		defaultVal: false,
		type: 'select',
    valueType: 'boolean',
		values: [
			{ label: 'yes', value: true },
			{ label: 'no', value: false }
		]
	}
];

export default settings;

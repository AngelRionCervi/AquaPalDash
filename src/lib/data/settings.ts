import type { Setting } from '$lib/components/Settings/type';

const settings: Array<Setting> = [
	{
		name: 'Schedule auto turn on after:',
		defaultVal: 30,
		type: 'select',
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
		name: 'Theme:',
		defaultVal: 'light',
		type: 'select',
		values: [
			{ label: 'light', value: 'light' },
			{ label: 'dark', value: 'dark' }
		]
	},
	{
		name: 'Temperature unit:',
		defaultVal: 'celsius',
		type: 'select',
		values: [
			{ label: 'celsius', value: 'celsius' },
			{ label: 'fahrenheit', value: 'fahrenheit' }
		]
	},
	{
		name: 'Aquarium label:',
		defaultVal: 'Main aquarium',
		type: 'text'
	},
	{
		name: 'Prefetch historical sensors data:',
		defaultVal: false,
		type: 'select',
		values: [
			{ label: 'yes', value: true },
			{ label: 'no', value: false }
		]
	}
];

export default settings;

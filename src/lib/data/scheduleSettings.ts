export interface ScheduleRadioType {
	label: string;
	id: string;
	name: string;
	value: string;
	checked: boolean;
}

const scheduleRadioTypes: Array<ScheduleRadioType> = [
	{
		label: 'Always on',
		id: 'alwaysOnChoice',
		name: 'scheduleType',
		value: 'alwaysOn',
		checked: true
	},
	{
		label: 'Always off',
		id: 'alwaysOffChoice',
		name: 'scheduleType',
		value: 'alwaysOff',
		checked: false
	},
	{ label: 'Range', id: 'rangeChoice', name: 'scheduleType', value: 'range', checked: false }
];

export default scheduleRadioTypes;

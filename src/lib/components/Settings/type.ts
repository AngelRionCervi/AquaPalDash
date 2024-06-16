export interface SettingValue {
	label: string;
	value: string | number | boolean;
}

export interface Setting {
	name: string;
	defaultVal: string | number | boolean;
	type: string;
	values?: Array<SettingValue>;
}

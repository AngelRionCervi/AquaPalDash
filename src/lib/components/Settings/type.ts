import type { ConfigSettings } from "$lib/types";

export interface SettingValue {
	label: string;
	value: string | number | boolean;
}

export interface Setting {
	label: string;
	name: keyof ConfigSettings;
	defaultVal: string | number | boolean;
	type: string;
	valueType: string;
	values?: Array<SettingValue>;
}

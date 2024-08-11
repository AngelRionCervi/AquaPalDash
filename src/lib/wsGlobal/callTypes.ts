const box_handShakeType = 'box_handshake';
const box_initType = 'box_init';
const box_updateConfigType = 'box_update_config';
const box_deviceToggleType = 'box_device_manual_toggle';
const box_scheduleToggleType = 'box_schedule_toggle';
const box_getDevicesInfoType = 'box_get_devices_infos';
const box_getHardwareToggleUpdateType = 'box_get_hardware_toggle_update';
const box_getConfigType = 'box_get_config';
const box_getScheduleStateType = 'box_get_schedule_state';
const box_pingType = 'box_ping';
const box_restartType = 'box_restart';
const box_fetchLastType = 'box_fetch_last';
const box_fetchHistoricalType = 'box_fetch_historical';

const dash_handShakeType = 'dash_handshake';
const dash_setConfigType = 'dash_set_config';

const BOX_CALL_TYPES = {
	box_handShakeType,
	box_initType,
	box_updateConfigType,
	box_deviceToggleType,
	box_scheduleToggleType,
	box_getDevicesInfoType,
	box_getHardwareToggleUpdateType,
	box_getConfigType,
	box_getScheduleStateType,
	box_pingType,
	box_restartType,
	box_fetchLastType,
	box_fetchHistoricalType
};

const DASH_CALL_TYPES = {
	dash_handShakeType,
  dash_setConfigType
};

export { BOX_CALL_TYPES, DASH_CALL_TYPES };

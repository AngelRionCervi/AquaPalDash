const box_handShakeType = 'box_handshake';
const box_initType = 'box_init';
const box_updateConfigType = 'box_update_config';
const box_resultUpdateConfigType = 'box_result_update_config';
const box_deviceToggleType = 'box_device_manual_toggle';
const box_scheduleToggleType = 'box_schedule_toggle';
const box_getDevicesInfoType = 'box_get_devices_infos';
const box_getConfigType = 'box_get_config';
const box_getScheduleStateType = 'box_get_schedule_state';
const box_pingType = 'box_ping';
const box_restartType = 'box_restart';
const box_monitoringGetLastType = 'box_monitoring_get_last';
const box_monitoringGetHistoricalType = 'box_monitoring_get_historical';
const box_monitoringGetLiveType = 'box_monitoring_get_live';
const box_startHistoricalType = 'box_start_historical';
const box_endHistoricalType = 'box_end_historical';
const box_historicalDataStreamType = 'box_hds';
const box_setOnPhPhCalibrationType = 'box_set_on_ph_calibration';
const box_setOffPhPhCalibrationType = 'box_set_off_ph_calibration';
const box_phMvCalibrationType = 'box_ph_mv_calibration';
const box_hardwareToggleType = 'box_hardware_toggle';

const dash_handShakeType = 'dash_handshake';
const dash_setConfigType = 'dash_set_config';
const dash_setDevicesInfoType = 'dash_set_devices_infos';
const dash_updateConfigType = 'dash_update_config';
const dash_resultUpdateConfigType = 'dash_result_update_config';
const dash_pingType = 'dash_ping';
const dash_restartType = 'dash_restart';
const dash_resultBoxRestartType = 'dash_result_box_restart';
const dash_getConfigType = 'dash_get_config';
const dash_toggleDeviceType = 'dash_toggle_device';
const dash_resultToggleDeviceType = 'dash_result_toggle_device';
const dash_toggleScheduleType = 'dash_toggle_schedule';
const dash_resultToggleScheduleType = 'dash_result_toggle_schedule';
const dash_getScheduleStateType = 'dash_get_schedule_state';
const dash_resultGetScheduleStateType = 'dash_result_get_schedule_state';
const dash_setUserIdType = 'dash_set_user_id';
const dash_monitoringGetLastType = 'dash_monitoring_get_last';
const dash_resultMonitoringGetLastType = 'dash_result_monitoring_get_last';
const dash_monitoringGetHistoricalType = 'dash_monitoring_get_historical';
const dash_resultMonitoringGetHistoricalType = 'dash_result_monitoring_get_historical';
const dash_resultMonitoringGetLiveType = 'dash_result_monitoring_get_live';
const dash_startHistoricalType = 'dash_start_historical';
const dash_endHistoricalType = 'dash_end_historical';
const dash_historicalDataStreamType = 'dash_hds';
const dash_setOnPhCalibrationType = 'dash_set_on_ph_calibration';
const dash_setOffPhCalibrationType = 'dash_set_off_ph_calibration';
const dash_phMvCalibrationType = 'dash_ph_mv_calibration';
const dash_hardwareToggleType = 'dash_hardware_toggle';

const BOX_CALL_TYPES = {
  box_handShakeType,
  box_initType,
  box_updateConfigType,
  box_resultUpdateConfigType,
  box_deviceToggleType,
  box_scheduleToggleType,
  box_getDevicesInfoType,
  box_getConfigType,
  box_getScheduleStateType,
  box_pingType,
  box_restartType,
  box_monitoringGetLastType,
  box_monitoringGetHistoricalType,
  box_historicalDataStreamType,
  box_startHistoricalType,
  box_endHistoricalType,
  box_monitoringGetLiveType,
  box_setOnPhPhCalibrationType,
  box_setOffPhPhCalibrationType,
  box_phMvCalibrationType,
  box_hardwareToggleType
};

const DASH_CALL_TYPES = {
  dash_handShakeType,
  dash_setConfigType,
  dash_setDevicesInfoType,
  dash_updateConfigType,
  dash_resultUpdateConfigType,
  dash_pingType,
  dash_restartType,
  dash_resultBoxRestartType,
  dash_getConfigType,
  dash_toggleDeviceType,
  dash_resultToggleDeviceType,
  dash_toggleScheduleType,
  dash_resultToggleScheduleType,
  dash_getScheduleStateType,
  dash_resultGetScheduleStateType,
  dash_setUserIdType,
  dash_monitoringGetLastType,
  dash_resultMonitoringGetLastType,
  dash_monitoringGetHistoricalType,
  dash_resultMonitoringGetHistoricalType,
  dash_startHistoricalType,
  dash_endHistoricalType,
  dash_historicalDataStreamType,
  dash_resultMonitoringGetLiveType,
  dash_setOnPhCalibrationType,
  dash_setOffPhCalibrationType,
  dash_phMvCalibrationType,
  dash_hardwareToggleType
};

export { BOX_CALL_TYPES, DASH_CALL_TYPES };

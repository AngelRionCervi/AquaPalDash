export const MAX_DEVICES = 5;
export const GET_MONITORING_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 mins;
export const TIMEOUT_FETCH_CONFIG = 30000;
export const TIMEOUT_PING_CONTROLLER = 60000;
export const PING_CONTROLLER_FREQUENCY = 20000;
export const WIFI_LIST_QUERY_INTERVAL = 10000;
export const NO_WIFI_NETWORKS_FOUND_TIMEOUT = 30000;
export const CONNECT_TO_PAL_AFTER_SETUP_TIMEOUT = 30000;
export const DEFAULT_HISTORICAL_DAYS = 30;
export const MOBILE_BP = 768;
export const BLUETOOTH_GATT_SERVICE_UUID = '0880619c-4a5f-4420-a3fa-496713d52298';
export const BLUETOOTH_CHARACTERISTICS_UUID_MAP = {
  ssid: 'beb5483e-36e1-4688-b7f5-ea07361b26a8',
  wifi_pass: '30855ddd-1312-43be-a6e1-1b8d188c43d2',
  wifi_list: '9b148ccd-66d1-49e2-9642-074d9ab49897',
  config_done: 'f4187856-ff8e-402a-b609-1486b775c94f',
  wifi_tested: '240651d4-5b43-413c-a88d-209b7a9257ba',
  restart: 'd7543730-e033-44e0-b83c-db7a5ddb6e61'
};
export const BT_SSID_CHARACTERISTIC_NAME = 'ssid';
export const BT_WIFIPASS_CHARACTERISTIC_NAME = 'wifi_pass';
export const BT_CONFIG_DONE_CHARACTERISTIC_NAME = 'config_done';
export const BT_WIFI_LIST_CHARACTERISTIC_NAME = 'wifi_list';
export const BT_WIFI_TESTED_CHARACTERISTIC_NAME = 'wifi_tested';
export const BT_RESTART_CHARACTERISTIC_NAME = 'restart';
export const AQUA_PAL_NAME = 'Aqua Pal';
export const MIN_PASSWORD_LENGTH = 8;
export const SMART_PLUG_TYPES = [
  { label: 'Shelly Plug S', value: 'shelly_plug_s' },
  { label: 'Tasmota', value: 'tasmota_plug' }
] as const;

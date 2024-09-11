import {
  BLUETOOTH_CHARACTERISTICS_UUID_MAP,
  BLUETOOTH_GATT_SERVICE_UUID,
  BT_WIFI_LIST_CHARACTERISTIC_NAME,
  BT_WIFI_TESTED_CHARACTERISTIC_NAME,
  WIFI_LIST_QUERY_INTERVAL
} from '$lib/constants';
import { sleep } from '$lib/helpers/utils';
import type { WifiNetwork } from '$lib/types';

interface BluetoothState {
  isBluetoothEnabled: boolean;
  isScanning: boolean;
  connectedDevice: BluetoothDevice | null;
  error: string;
  GATTServer: BluetoothRemoteGATTServer | null;
  wifiList: Array<WifiNetwork>;
  queryWifiListInterval: ReturnType<typeof setInterval> | null;
  isSelectedWifiTested: boolean;
  isSelectedWifiError: boolean;
}

interface BluetoothStore {
  isBluetoothEnabled: boolean;
  isScanning: boolean;
  connectedDevice: BluetoothDevice | null;
  error: string;
  GATTServer: BluetoothRemoteGATTServer | null;
  wifiList: Array<WifiNetwork>;
  queryWifiListInterval: ReturnType<typeof setInterval> | null;
  isSelectedWifiTested: boolean;
  isSelectedWifiError: boolean;
  init: () => void;
  findDevice: () => Promise<boolean>;
  writeToCharacteristic: (characName: keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, value: string) => Promise<boolean>;
  writeToMultipleCharacteristics: (characNames: Record<keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, string>) => Promise<boolean[]>;
  readCharacteristic: (characName: keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP) => Promise<string | undefined>;
  onGattServerDisconnected: () => Promise<void>;
  toggleWifiListInterval: (onOrOff: boolean) => void;
  updateWifiList: () => Promise<void>;
  stopBluetooth: () => Promise<void>;
  subscribeToWifiTestedCharacteristic: () => Promise<void>;
}

const defaultBluetoothStoreValue: BluetoothState = {
  isBluetoothEnabled: false,
  isScanning: false,
  isSelectedWifiTested: false,
  isSelectedWifiError: false,
  connectedDevice: null,
  error: '',
  GATTServer: null,
  wifiList: [],
  queryWifiListInterval: null
};

const bluetoothState = $state<BluetoothState>(defaultBluetoothStoreValue);

const bluetoothStore: BluetoothStore = {
  get isBluetoothEnabled() {
    return bluetoothState.isBluetoothEnabled;
  },
  get isScanning() {
    return bluetoothState.isScanning;
  },
  get connectedDevice() {
    return bluetoothState.connectedDevice;
  },
  get error() {
    return bluetoothState.error;
  },
  get GATTServer() {
    return bluetoothState.GATTServer;
  },
  get wifiList() {
    return bluetoothState.wifiList;
  },
  get queryWifiListInterval() {
    return bluetoothState.queryWifiListInterval;
  },
  get isSelectedWifiTested() {
    return bluetoothState.isSelectedWifiTested;
  },
  get isSelectedWifiError() {
    return bluetoothState.isSelectedWifiError;
  },
  set isSelectedWifiError(value: boolean) {
    bluetoothState.isSelectedWifiError = value;
  },
  set isSelectedWifiTested(value: boolean) {
    bluetoothState.isSelectedWifiTested = value;
  },
  set error(err: string) {
    bluetoothState.error = err;
    console.error('Bluetooth error: ', err);
  },
  init() {
    if ('bluetooth' in navigator) {
      bluetoothState.isBluetoothEnabled = true;
    }
  },
  async findDevice() {
    if (!bluetoothState.isBluetoothEnabled) {
      bluetoothState.error = 'Bluetooth is not enabled !';
      return false;
    }
    try {
      bluetoothState.isScanning = true;
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [BLUETOOTH_GATT_SERVICE_UUID]
          }
        ]
      });
      device.addEventListener('gattserverdisconnected', bluetoothStore.onGattServerDisconnected);
      bluetoothState.GATTServer = (await device.gatt?.connect()) || null;

      bluetoothState.connectedDevice = device;

      console.log('bluetooth device found !', device);
    } catch (error) {
      bluetoothStore.error = 'Bluetooth error: ' + error;
    } finally {
      bluetoothState.isScanning = false;
    }

    return !!bluetoothState.GATTServer;
  },
  async updateWifiList() {
    const wifiList = await bluetoothStore.readCharacteristic(BT_WIFI_LIST_CHARACTERISTIC_NAME);
    if (wifiList) {
      bluetoothState.wifiList = parseWifiList(wifiList);
    }
  },
  toggleWifiListInterval(onOrOff: boolean) {
    clearInterval(bluetoothState?.queryWifiListInterval || undefined);
    bluetoothState.queryWifiListInterval = null;

    if (!onOrOff) {
      return;
    }

    bluetoothState.queryWifiListInterval = setInterval(() => {
      bluetoothStore.updateWifiList();
    }, WIFI_LIST_QUERY_INTERVAL);
  },
  async subscribeToWifiTestedCharacteristic() {
    if (!bluetoothState.GATTServer) {
      bluetoothStore.error = 'No GATT server found !';
      return;
    }

    const characUUID = BLUETOOTH_CHARACTERISTICS_UUID_MAP.wifi_tested;

    if (!characUUID) {
      bluetoothStore.error = `Characteristic wifiTested not found !`;
      return;
    }

    try {
      bluetoothStore.toggleWifiListInterval(false);
      await sleep(3000);
      const service = await bluetoothState.GATTServer.getPrimaryService(BLUETOOTH_GATT_SERVICE_UUID);
      const charac = await service.getCharacteristic(characUUID);
      await charac.startNotifications();

      charac.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        const decoder = new TextDecoder('utf-8');
        const decodedValue = decoder.decode(value);
        bluetoothState.isSelectedWifiTested = false;
        bluetoothState.isSelectedWifiError = false;
        setTimeout(() => {
          bluetoothState.isSelectedWifiTested = decodedValue === 'true';
          bluetoothState.isSelectedWifiError = decodedValue === 'error';
        });

        console.log('WIFI_TESTED value changed:', decodedValue);
      });
    } catch (err) {
      bluetoothStore.error = `Error subscribing to ${BT_WIFI_TESTED_CHARACTERISTIC_NAME} characteristic with UUID ${characUUID}: ${err}`;
    } finally {
      bluetoothStore.toggleWifiListInterval(true);
    }
  },
  async writeToCharacteristic(characName: keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, value: string) {
    if (!bluetoothState.GATTServer) {
      bluetoothStore.error = 'No GATT server found !';
      return false;
    }

    const characUUID = BLUETOOTH_CHARACTERISTICS_UUID_MAP[characName];

    if (!characUUID) {
      bluetoothStore.error = `Characteristic ${characName} not found !`;
      return false;
    }

    try {
      const service = await bluetoothState.GATTServer.getPrimaryService(BLUETOOTH_GATT_SERVICE_UUID);
      const charac = await service.getCharacteristic(characUUID);
      const encodedText = new TextEncoder().encode(value);
      await charac.writeValue(encodedText);
      return true;
    } catch (err) {
      bluetoothStore.error = `Error writing to characteristic ${characName} with UUID ${characUUID}: ${err}`;
      return false;
    }
  },
  writeToMultipleCharacteristics(characNames: Record<keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, string>) {
    const writePromises = Object.entries(characNames).map(([characName, value]) =>
      bluetoothStore.writeToCharacteristic(characName as keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, value)
    );

    return Promise.all(writePromises);
  },
  async readCharacteristic(characName: keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP) {
    console.log('"readCharacteristic" called with characName:', characName);
    if (!bluetoothState.GATTServer) {
      bluetoothStore.error = 'No GATT server found !';
      return;
    }

    const characUUID = BLUETOOTH_CHARACTERISTICS_UUID_MAP[characName];

    if (!characUUID) {
      bluetoothStore.error = `Characteristic ${characName} not found !`;
      return;
    }

    try {
      const service = await bluetoothState.GATTServer.getPrimaryService(BLUETOOTH_GATT_SERVICE_UUID);
      const charac = await service.getCharacteristic(characUUID);
      const rawValue = await charac.readValue();
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(rawValue);
    } catch (err) {
      bluetoothStore.error = `Error reading characteristic ${characName} with UUID ${characUUID}: ${err}`;
    }
  },
  async onGattServerDisconnected() {
    if (bluetoothState.GATTServer) {
      bluetoothState.GATTServer = null;
      bluetoothState.connectedDevice?.removeEventListener('gattserverdisconnected', bluetoothStore.onGattServerDisconnected);
      await bluetoothState.connectedDevice?.forget();
      bluetoothState.connectedDevice = null;
    }
  },
  async stopBluetooth() {
    console.log('STOP BTC CALLED')
    bluetoothStore.toggleWifiListInterval(false);
    bluetoothState.isScanning = false;
    bluetoothState.error = '';
    bluetoothState.wifiList = [];
    bluetoothState.isSelectedWifiTested = false;
    bluetoothState.isSelectedWifiError = false;

    if (bluetoothState.connectedDevice) {
      await bluetoothState.connectedDevice?.forget();
      bluetoothState.connectedDevice = null;
    }

    if (bluetoothState.GATTServer) {
      bluetoothState.GATTServer.disconnect();
      bluetoothState.GATTServer = null;
    }
  }
};

function parseWifiList(wifiList: string) {
  try {
    const parsedWifiList = JSON.parse(wifiList) as WifiNetwork[];
    for (const wifi of parsedWifiList) {
      wifi.fingerprint = `${wifi.ssid}-${wifi.channel}-${wifi.encryptionType}`;
    }
    return parsedWifiList;
  } catch (err) {
    bluetoothStore.error = `Error parsing wifi list: ${err}`;
    return [];
  }
}

export default bluetoothStore;

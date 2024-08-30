import { BLUETOOTH_GATT_SERVICE_UUID } from '$lib/constants';

interface BluetoothState {
  isBluetoothEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  error: string;
  scan: null | BluetoothLEScan;
}

interface BluetoothStore {
  isBluetoothEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  error: string;
  startScan: () => void;
  stopScan: () => void;
  connectDevice: (device: BluetoothDevice) => void;
  disconnectDevice: () => void;
  init: () => void;
}

const defaultBluetoothStoreValue: BluetoothState = {
  isBluetoothEnabled: false,
  isScanning: false,
  devices: [],
  connectedDevice: null,
  error: '',
  scan: null
};

const bluetoothState = $state<BluetoothState>(defaultBluetoothStoreValue);

const bluetoothStore: BluetoothStore = {
  get isBluetoothEnabled() {
    return bluetoothState.isBluetoothEnabled;
  },
  get isScanning() {
    return bluetoothState.scan !== null;
  },
  get devices() {
    return bluetoothState.devices;
  },
  get connectedDevice() {
    return bluetoothState.connectedDevice;
  },
  get error() {
    return bluetoothState.error;
  },
  set error(value: string) {
    bluetoothState.error = value;
    console.error('Bluetooth error: ', value);
  },
  init() {
    if ('bluetooth' in navigator) {
      bluetoothState.isBluetoothEnabled = true;
    }
  },
  async startScan() {
    if (!bluetoothState.isBluetoothEnabled) {
      bluetoothState.error = 'Bluetooth is not enabled !';
      return;
    }
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: [BLUETOOTH_GATT_SERVICE_UUID]
          }
        ]
      });
      console.log('bluetooth device found !!!', device);
    } catch (error) {
      bluetoothState.error = 'Bluetooth error: ' + error;
    }
  },
  stopScan() {
    if (bluetoothState.scan) {
      bluetoothState.scan.stop();
      bluetoothState.scan = null;
    }
  },
  connectDevice(device: BluetoothDevice) {
    bluetoothState.connectedDevice = device;
  },
  disconnectDevice() {
    bluetoothState.connectedDevice = null;
  }
};

export default bluetoothStore;

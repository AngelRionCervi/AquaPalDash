import { BLUETOOTH_CHARACTERISTICS_UUID_MAP, BLUETOOTH_GATT_SERVICE_UUID } from '$lib/constants';

interface BluetoothState {
  isBluetoothEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  error: string;
  GATTServer: BluetoothRemoteGATTServer | null;
}

interface BluetoothStore {
  isBluetoothEnabled: boolean;
  isScanning: boolean;
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  error: string;
  GATTServer: BluetoothRemoteGATTServer | null;
  init: () => void;
  findDevice: () => Promise<boolean>;
  writeToCharacteristic: (characName: keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, value: string) => Promise<boolean>;
  writeToMultipleCharacteristics: (characNames: Record<keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP, string>) => Promise<boolean[]>;
  readCharacteristic: (characName: keyof typeof BLUETOOTH_CHARACTERISTICS_UUID_MAP) => Promise<string | undefined>;
}

const defaultBluetoothStoreValue: BluetoothState = {
  isBluetoothEnabled: false,
  isScanning: false,
  devices: [],
  connectedDevice: null,
  error: '',
  GATTServer: null
};

const bluetoothState = $state<BluetoothState>(defaultBluetoothStoreValue);

const bluetoothStore: BluetoothStore = {
  get isBluetoothEnabled() {
    return bluetoothState.isBluetoothEnabled;
  },
  get isScanning() {
    return bluetoothState.isScanning;
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
  get GATTServer() {
    return bluetoothState.GATTServer;
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
      device.addEventListener('gattserverdisconnected', () => {
        bluetoothState.GATTServer = null;
        console.log('Bluetooth device disconnected !');
      });
      bluetoothState.GATTServer = (await device.gatt?.connect()) || null;

      console.log('bluetooth device found !', device);
    } catch (error) {
      bluetoothStore.error = 'Bluetooth error: ' + error;
    } finally {
      bluetoothState.isScanning = false;
    }

    return !!bluetoothState.GATTServer;
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
  }
};

export default bluetoothStore;

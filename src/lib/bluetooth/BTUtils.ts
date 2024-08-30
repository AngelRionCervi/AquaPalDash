export async function checkIfBluetoothIsEnabled() {
  if (!navigator.bluetooth) {
    console.error('This browser does not support the Web Bluetooth API');
    return false;
  }
  const adapter = await navigator?.bluetooth.getAvailability();
  if (!adapter) {
    console.error('Bluetooth is not enabled');
    return false;
  }
  return true;
}

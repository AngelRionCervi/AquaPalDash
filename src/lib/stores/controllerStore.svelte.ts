import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';
import devicesStatusStore from './deviceStatusStore.svelte';
import authStore from './authStore.svelte';
import { sendWSMessage } from '$lib/wsClient/WSClientHandler';

interface CallState {
  isLoading?: boolean;
  error?: string;
}

type BasicCallStates = Record<
  Exclude<
    keyof ControllerStore,
    | 'isRestarting'
    | 'isOn'
    | 'isScheduleOn'
    | 'callStates'
    | 'restartController'
    | 'toggleDevice'
    | 'deviceCallStates'
    | 'loadMockData'
    | 'handleRestarted'
    | 'resultToggleDevice'
    | 'errorToggleDevice'
    | 'resultToggleSchedule'
    | 'setIsOn'
    | 'handleRestarting'
    | 'pingController'
    | 'elapsedNoResponseTime'
  >,
  CallState
>;

interface ControllerState {
  isRestarting: boolean;
  isOn: boolean;
  isScheduleOn: boolean;
  checkUpdateWithInterval: number;
  callStates: BasicCallStates;
  deviceCallStates: Record<string, CallState>;
}

interface ControllerStore {
  isRestarting: ControllerState['isRestarting'];
  isOn: ControllerState['isOn'];
  isScheduleOn: ControllerState['isScheduleOn'];
  callStates: ControllerState['callStates'];
  deviceCallStates: ControllerState['deviceCallStates'];
  elapsedNoResponseTime: number;
  restartController: () => void;
  handleRestarted: () => void;
  toggleSchedule: () => void;
  resultToggleSchedule: (state: boolean) => void;
  toggleDevice: (id: string) => void;
  resultToggleDevice: ({ id, state }: { id: string; state: boolean }) => void;
  errorToggleDevice: (id: string) => void;
  loadMockData: () => void;
  setIsOn: (isOn: boolean) => void;
  handleRestarting: () => void;
  pingController: () => void;
}

const callStates: ControllerState['callStates'] = $state({
  checkHardwareUpdate: {},
  toggleSchedule: {}
});

const deviceCallStates: ControllerState['deviceCallStates'] = $state({});

const defaultControllerStoreValue: ControllerState = {
  isRestarting: false,
  isOn: false,
  isScheduleOn: false,
  checkUpdateWithInterval: 0,
  callStates,
  deviceCallStates
};

const constrollerState = $state<ControllerState>(defaultControllerStoreValue);

const controllerStore: ControllerStore = {
  get isRestarting() {
    return constrollerState.isRestarting;
  },
  get isOn() {
    return constrollerState.isOn;
  },
  get isScheduleOn() {
    return constrollerState.isScheduleOn;
  },
  get callStates() {
    return constrollerState.callStates;
  },
  get deviceCallStates() {
    return constrollerState.deviceCallStates;
  },
  get elapsedNoResponseTime() {
    return constrollerState.checkUpdateWithInterval;
  },
  set elapsedNoResponseTime(value: number) {
    constrollerState.checkUpdateWithInterval = value;
  },
  loadMockData() {
    constrollerState.isOn = true;
    constrollerState.isScheduleOn = true;
  },
  toggleSchedule() {
    if (authStore.isDemoMode) {
      constrollerState.isScheduleOn = !constrollerState.isScheduleOn;
      return;
    }
    callStates.toggleSchedule.isLoading = true;
    sendWSMessage({ type: DASH_CALL_TYPES.dash_toggleScheduleType });
  },
  resultToggleSchedule(state: boolean) {
    constrollerState.isScheduleOn = state;
    callStates.toggleSchedule.isLoading = false;
  },
  setIsOn(isOn: boolean) {
    constrollerState.isOn = isOn;
    if (isOn) {
      controllerStore.elapsedNoResponseTime = 0;
    }
  },
  pingController() {
    if (authStore.isDemoMode) return;

    sendWSMessage({ type: DASH_CALL_TYPES.dash_pingType });
  },
  toggleDevice(id: string) {
    if (constrollerState.isScheduleOn) return;

    if (!deviceCallStates[id]) {
      deviceCallStates[id] = {};
    }

    if (authStore.isDemoMode) {
      devicesStatusStore.updateDeviceState(id, !devicesStatusStore.getDeviceStatus(id)?.isOn);
      return;
    }

    deviceCallStates[id].isLoading = true;
    sendWSMessage({ type: DASH_CALL_TYPES.dash_toggleDeviceType, data: id });
  },
  resultToggleDevice({ id, state }) {
    devicesStatusStore.updateDeviceState(id, state);
    deviceCallStates[id].isLoading = false;
  },
  errorToggleDevice(id: string) {
    if (deviceCallStates[id]) {
      deviceCallStates[id].isLoading = false;
    }
  },
  handleRestarting() {
    constrollerState.isRestarting = true;
  },
  restartController() {
    if (authStore.isDemoMode) return;

    sendWSMessage({ type: DASH_CALL_TYPES.dash_restartType });
  },
  handleRestarted() {
    constrollerState.isRestarting = false;
  }
};

export default controllerStore;

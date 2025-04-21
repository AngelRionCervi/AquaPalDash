import authStore from '$lib/stores/authStore.svelte';
import configStore from '$lib/stores/configStore.svelte';
import controllerStore from '$lib/stores/controllerStore.svelte';
import devicesStatusStore from '$lib/stores/deviceStatusStore.svelte';
import monitoringStore, { type LiveMonitoringPayload, type RawMonitoringPayload } from '$lib/stores/monitoringStore.svelte';
import type { RawDeviceStatus, Config } from '$lib/types';
import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';
import { jstr, parseMessage } from '$wsGlobal/wsUtils';

let ws: WebSocket;

function checkForError(message: Record<string, unknown>) {
  if (message.type === DASH_CALL_TYPES.dash_resultToggleDeviceType && message.info) {
    const info = message.info as { id: string };
    controllerStore.errorToggleDevice(info.id || '');
  }
  if (message.status === 'error') {
    console.error('Error WS message', message);
    return false;
  }

  return true;
}

function handleMessage(ws: WebSocket, message: Record<string, unknown>) {
  console.debug('[websocket] message received', message);
  if (!checkForError(message)) return;

  switch (message.type) {
    case DASH_CALL_TYPES.dash_handShakeType: {
      console.debug('controller restarted !');

      controllerStore.handleRestarted();
      configStore.handleConfigUpdated();
      configStore.queryConfig();
      break;
    }
    case DASH_CALL_TYPES.dash_setConfigType: {
      configStore.setConfig(message.data as Config);
      controllerStore.setIsOn(true);
      authStore.needLogin = false;
      break;
    }
    case DASH_CALL_TYPES.dash_setDevicesInfoType: {
      devicesStatusStore.updateAllDevicesStatus(message.data as Array<RawDeviceStatus>);
      break;
    }
    case DASH_CALL_TYPES.dash_resultUpdateConfigType: {
      controllerStore.restartController();
      break;
    }
    case DASH_CALL_TYPES.dash_resultBoxRestartType: {
      controllerStore.handleRestarting();
      break;
    }
    case DASH_CALL_TYPES.dash_resultToggleDeviceType: {
      controllerStore.resultToggleDevice(message.data as { id: string; state: boolean });
      break;
    }
    case DASH_CALL_TYPES.dash_resultToggleScheduleType: {
      controllerStore.resultToggleSchedule(message.data as boolean);
      break;
    }
    case DASH_CALL_TYPES.dash_resultGetScheduleStateType: {
      controllerStore.resultToggleSchedule(message.data as boolean);
      break;
    }
    case DASH_CALL_TYPES.dash_setUserIdType: {
      authStore.setUserId(message.data as string);
      break;
    }
    case DASH_CALL_TYPES.dash_resultMonitoringGetLastType: {
      monitoringStore.updateHistoricalLast(message.data as RawMonitoringPayload);
      break;
    }
    case DASH_CALL_TYPES.dash_resultMonitoringGetLiveType: {
      monitoringStore.updateLive(message.data as LiveMonitoringPayload);
      break;
    }
    case DASH_CALL_TYPES.dash_startHistoricalType: {
      monitoringStore.updateHistorical('start', message.data as string);
      break;
    }
    case DASH_CALL_TYPES.dash_historicalDataStreamType: {
      monitoringStore.updateHistorical('stream', message.data as string);
      break;
    }
    case DASH_CALL_TYPES.dash_endHistoricalType: {
      monitoringStore.updateHistorical('end', message.data as string);
      break;
    }
    case DASH_CALL_TYPES.dash_phMvCalibrationType: {
      monitoringStore.setPhMv(message.data as number);
      break;
    }
    case DASH_CALL_TYPES.dash_pingType: {
      controllerStore.setIsOn(true);
      break;
    }
    case DASH_CALL_TYPES.dash_hardwareToggleType: {
      controllerStore.resultHardwareToggle(message.data as Array<{ id: string; state: boolean }>);
      break;
    }
  }
}

function WSClientHandler(onOpen: () => void, onClose: () => void) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const { hostname } = window.location;
  const host = hostname.startsWith('192.168.1.') ? `${hostname}:3000` : hostname;
  ws = new WebSocket(`${protocol}//${host}/websocket`);

  function onConnectionOpen() {
    onOpen();
  }

  function onConnectionClose() {
    onClose();
  }

  function onMessage(event: WebSocketEventMap['message']) {
    const message = event.data;
    const parsedMessage = parseMessage(message);
    handleMessage(ws, parsedMessage);
  }

  ws.addEventListener('open', onConnectionOpen);
  ws.addEventListener('close', onConnectionClose);
  ws.addEventListener('message', onMessage);
}

export const sendWSMessage = (message: Record<string, unknown>) => {
  if (authStore.isDemoMode) return;

  const userId = authStore.userId;

  if (!userId && message.type !== DASH_CALL_TYPES.dash_handShakeType) {
    console.error('No userId set, cannot send message', message, userId);
    return;
  }

  message.source = 'dash';
  message.userId = userId || '';

  if (!ws) {
    console.error('WS connection is not open');
    return;
  }

  ws.send(jstr(message));
};

export default WSClientHandler;

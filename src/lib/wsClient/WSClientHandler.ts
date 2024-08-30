import authStore from '$lib/stores/authStore.svelte';
import configStore from '$lib/stores/configStore.svelte';
import controllerStore from '$lib/stores/controllerStore.svelte';
import devicesStatusStore from '$lib/stores/deviceStatusStore.svelte';
import monitoringStore, { type LiveMonitoringPayload, type RawMonitoringPayload } from '$lib/stores/monitoringStore.svelte';
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
  console.log('[websocket] parsed message received', message);
  if (!checkForError(message)) return;

  switch (message.type) {
    case DASH_CALL_TYPES.dash_handShakeType: {
      console.log('controller RESTARTED !');

      controllerStore.handleRestarted();
      configStore.handleConfigUpdated();
      configStore.queryConfig();
      break;
    }
    case DASH_CALL_TYPES.dash_setConfigType: {
      configStore.setConfig(message.data as Config);
      controllerStore.setIsOn(true);
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
      console.log('setUserId', message.data);
      authStore.setUserId(message.data as string);
      break;
    }
    case DASH_CALL_TYPES.dash_resultMonitoringGetLastType: {
      console.log('LAST HSITORICAL', message.data);
      monitoringStore.updateHistoricalLast(message.data as RawMonitoringPayload);
      break;
    }
    case DASH_CALL_TYPES.dash_resultMonitoringGetLiveType: {
      monitoringStore.updateLive(message.data as LiveMonitoringPayload);
      console.log('LIVE DATA', message.data);
      break;
    }
    case DASH_CALL_TYPES.dash_startHistoricalType: {
      monitoringStore.updateHistorical('start', message.data as string);
      console.log('START HISTORICAL DATA', message.data);
      break;
    }
    case DASH_CALL_TYPES.dash_historicalDataStreamType: {
      monitoringStore.updateHistorical('stream', message.data as string);
      console.log('HISTORICAL DATA ROW', message.data);
      break;
    }
    case DASH_CALL_TYPES.dash_endHistoricalType: {
      monitoringStore.updateHistorical('end', message.data as string);
      console.log('END HISTORICAL DATA', message.data);
      break;
    }
  }
}

function WSClientHandler(onOpen: () => void) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const { hostname } = window.location;
  console.log('window.location', window.location)
  const host = hostname.startsWith('192.168.1.') ? `${hostname}:3000` : hostname;
  ws = new WebSocket(`${protocol}//${host}/websocket`);
  console.log('WSClientHandler', ws);

  function onConnectionOpen(event: WebSocketEventMap['open']) {
    onOpen();
    console.log('[websocket] connection open', event);
  }

  function onConnectionClose(event: WebSocketEventMap['close']) {
    console.log('[websocket] connection closed', event);
  }

  function onMessage(event: WebSocketEventMap['message']) {
    console.log('[websocket] message received', event);
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

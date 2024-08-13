import authStore from '$lib/stores/authStore.svelte';
import configStore from '$lib/stores/configStore.svelte';
import controllerStore from '$lib/stores/controllerStore.svelte';
import devicesStatusStore from '$lib/stores/deviceStatusStore.svelte';
import { DASH_CALL_TYPES } from '$lib/wsGlobal/callTypes';
import { jstr, parseMessage } from '$lib/wsGlobal/wsUtils';

let ws: WebSocket;

function checkForError(message: Record<string, unknown>) {
	console.log('checkForError', message);
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

	if (message.type === DASH_CALL_TYPES.dash_handShakeType) {
		if (!checkForError(message)) return;
		console.log('controller RESTARTED !');

		controllerStore.handleRestarted();
		configStore.handleConfigUpdated();
		configStore.queryConfig();
	} else if (message.type === DASH_CALL_TYPES.dash_setConfigType) {
		if (!checkForError(message)) return;

		configStore.setConfig(message.data as Config);
		controllerStore.setIsOn(true);
	} else if (message.type === DASH_CALL_TYPES.dash_setDevicesInfoType) {
		if (!checkForError(message)) return;

		devicesStatusStore.updateAllDevicesStatus(message.data as Array<RawDeviceStatus>);
	} else if (message.type === DASH_CALL_TYPES.dash_resultUpdateConfigType) {
		if (!checkForError(message)) return;

		controllerStore.restartController();
	} else if (message.type === DASH_CALL_TYPES.dash_resultBoxRestartType) {
		if (!checkForError(message)) return;

		controllerStore.handleRestarting();
	} else if (message.type === DASH_CALL_TYPES.dash_resultToggleDeviceType) {
		if (!checkForError(message)) return;

		controllerStore.resultToggleDevice(message.data as { id: string; state: boolean });
	} else if (message.type === DASH_CALL_TYPES.dash_resultToggleScheduleType) {
		if (!checkForError(message)) return;

		controllerStore.resultToggleSchedule(message.data as boolean);
	} else if (message.type === DASH_CALL_TYPES.dash_resultGetScheduleStateType) {
		if (!checkForError(message)) return;

		controllerStore.resultToggleSchedule(message.data as boolean);
	}
}

function WSClientHandler() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	console.log('window.location', window.location);
	const { hostname } = window.location;
	ws = new WebSocket(
		`${protocol}//${hostname}${hostname === 'localhost' ? ':3000' : ''}/websocket`
	);
	console.log('WSClientHandler', ws);

	function onConnectionOpen(event: WebSocketEventMap['open']) {
		console.log('[websocket] connection open', event);
		const handshakePayload = JSON.stringify({
			source: 'dash',
			type: DASH_CALL_TYPES.dash_handShakeType
		});
		ws.send(handshakePayload);
	}

	function onConnectionClose(event: WebSocketEventMap['close']) {
		console.log('[websocket] connection closed', event);
	}

	function onMessage(event: WebSocketEventMap['message']) {
		console.log('[websocket] message received', event);
		const parsedMessage = parseMessage(event.data);
		handleMessage(ws, parsedMessage);
	}

	ws.addEventListener('open', onConnectionOpen);
	ws.addEventListener('close', onConnectionClose);
	ws.addEventListener('message', onMessage);
}

export const sendWSMessage = (message: Record<string, unknown>) => {
	if (authStore.isDemoMode) return;

	message.source = 'dash';
	if (!ws) {
		console.error('WS connection is not open');
		return;
	}
	ws.send(jstr(message));
};

export default WSClientHandler;

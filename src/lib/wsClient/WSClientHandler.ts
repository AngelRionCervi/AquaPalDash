import configStore from '$lib/stores/configStore.svelte';
import { DASH_CALL_TYPES } from '$lib/wsGlobal/callTypes';
import { parseMessage } from '$lib/wsGlobal/wsUtils';

function checkForError(message: Record<string, unknown>) {
  if (message.status === 'error') {
    console.error("Error WS message", message);
    return false;
  }

  return true;
}

function handleMessage(ws: WebSocket, message: Record<string, unknown>) {
  console.log('[websocket] parsed message received', message);

  if (message.type === DASH_CALL_TYPES.dash_setConfigType) {
    if (!checkForError(message)) return;

    configStore.setConfig(message.data);
  }
}

function WSClientHandler() {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const ws = new WebSocket(`${protocol}//${window.location.host}/websocket`);

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

export default WSClientHandler;

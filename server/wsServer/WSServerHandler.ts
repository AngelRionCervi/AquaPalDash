import type { WebSocketServer as WebsocketServerType } from 'ws';
import { BOX_CALL_TYPES, DASH_CALL_TYPES } from '$wsGlobal/callTypes';
import type { ExtendedWebSocket, ParsedSocketMessage } from './wsServer';
import { jstr, parseMessage } from '$wsGlobal/wsUtils';

type ValueOf<T> = T[keyof T];

function WSServerHandler(webSocketServer: WebsocketServerType) {
	const wss = webSocketServer;

	function getBoxClient() {
		return [...(wss.clients as Set<ExtendedWebSocket>)].find((client) => client.source === 'box');
	}

	function getDashClient() {
		return [...(wss.clients as Set<ExtendedWebSocket>)].find((client) => client.source === 'dash');
	}

	function sendToDash(
		dashClient: ExtendedWebSocket,
		callType: ValueOf<typeof DASH_CALL_TYPES>,
		message: ParsedSocketMessage
	) {
		dashClient.send(
			jstr({
				source: 'server',
				type: callType,
				data: message.data,
				status: message.status,
				info: message.info || null
			})
		);
	}

	function sendToBox(
		boxClient: ExtendedWebSocket,
		callType: ValueOf<typeof BOX_CALL_TYPES>,
		data: string | number | boolean | null = null
	) {
		boxClient.send(
			jstr({
				source: 'server',
				type: callType,
				data
			})
		);
	}

	function handleDashMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
		if (message.type === DASH_CALL_TYPES.dash_handShakeType) {
			socket.source = 'dash';
		}
		const boxClient = getBoxClient();
		if (!boxClient) {
			console.error('No box client found !');
			return;
		}

		console.log('handle dash message TYPE', message.type);
		if (message.type === DASH_CALL_TYPES.dash_handShakeType) {
			sendToBox(boxClient, BOX_CALL_TYPES.box_handShakeType);
		} else if (message.type === DASH_CALL_TYPES.dash_restartType) {
			sendToBox(boxClient, BOX_CALL_TYPES.box_restartType);
		} else if (message.type === DASH_CALL_TYPES.dash_getConfigType) {
			sendToBox(boxClient, BOX_CALL_TYPES.box_getConfigType);
		} else if (message.type === DASH_CALL_TYPES.dash_updateConfigType) {
			sendToBox(boxClient, BOX_CALL_TYPES.box_updateConfigType, message.data);
		} else if (message.type === DASH_CALL_TYPES.dash_toggleDeviceType) {
			sendToBox(boxClient, BOX_CALL_TYPES.box_deviceToggleType, message.data);
		} else if (message.type === DASH_CALL_TYPES.dash_toggleScheduleType) {
			sendToBox(boxClient, BOX_CALL_TYPES.box_scheduleToggleType);
		}
	}

	function handleBoxMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
		if (message.type === BOX_CALL_TYPES.box_handShakeType) {
			socket.source = 'box';
		}
		const dashClient = getDashClient();
		if (!dashClient) {
			console.error('No dash client found !');
			return;
		}

		if (message.type === BOX_CALL_TYPES.box_handShakeType) {
			socket.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_initType }));
			sendToDash(dashClient, DASH_CALL_TYPES.dash_handShakeType, message);
		} else if (message.type === BOX_CALL_TYPES.box_getConfigType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_setConfigType, message);
		} else if (message.type === BOX_CALL_TYPES.box_getDevicesInfoType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_setDevicesInfoType, message);
		} else if (message.type === BOX_CALL_TYPES.box_updateConfigType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_resultUpdateConfigType, message);
		} else if (message.type === BOX_CALL_TYPES.box_restartType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_resultBoxRestartType, message);
		} else if (message.type === BOX_CALL_TYPES.box_deviceToggleType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_resultToggleDeviceType, message);
		} else if (message.type === BOX_CALL_TYPES.box_scheduleToggleType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_resultToggleScheduleType, message);
		} else if (message.type === BOX_CALL_TYPES.box_getScheduleStateType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_resultGetScheduleStateType, message);
		} else if (message.type === BOX_CALL_TYPES.box_resultUpdateConfigType) {
			sendToDash(dashClient, DASH_CALL_TYPES.dash_resultUpdateConfigType, message);
		}
	}

	return function (socket: ExtendedWebSocket, rawData: string) {
		const parsedData = parseMessage(rawData.toString());
		if (!parsedData) {
			console.log(`Parsed message in falsy: ${parsedData}`);
		} else {
			console.log('parsedData', parsedData);
			if (parsedData.source === 'dash') {
				handleDashMessage(socket, parsedData);
			} else if (parsedData.source === 'box') {
				handleBoxMessage(socket, parsedData);
			}
		}
	};
}

export default WSServerHandler;

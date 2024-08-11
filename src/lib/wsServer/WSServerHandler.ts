import type { WebSocketServer as WebsocketServerType } from 'ws';
import { BOX_CALL_TYPES, DASH_CALL_TYPES } from '../wsGlobal/callTypes';
import type { ExtendedWebSocket, ParsedSocketMessage } from './wsServer';
import { jstr, parseMessage } from '../wsGlobal/wsUtils';

function WSServerHandler(webSocketServer: WebsocketServerType) {
	const wss = webSocketServer;

	function getBoxClient() {
    console.log("HEEEEY3", [...(wss.clients as Set<ExtendedWebSocket>)].map((client) => ({id: client.socketId, source: client.source})));
		return [...(wss.clients as Set<ExtendedWebSocket>)].find(
			(client) => client.source === 'box'
		);
	}

	function getDashClient() {
		return [...(wss.clients as Set<ExtendedWebSocket>)].find(
			(client) => client.source === 'dash'
		);
	}

	function handleDashMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
    console.log('handle dash message TYPE', message.type);
		if (message.type === DASH_CALL_TYPES.dash_handShakeType) {
			socket.source = 'dash';
			const boxClient = getBoxClient();
      console.log('boxClient', !!boxClient);
			if (!boxClient) {
				return;
			}

			boxClient.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_handShakeType }));
		}
	}

	function handleBoxMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
		console.log('handle box message TYPE', message.type);
		if (message.type === BOX_CALL_TYPES.box_handShakeType) {
			socket.source = 'box';
			socket.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_initType }));
		} else if (message.type === BOX_CALL_TYPES.box_getConfigType) {
			const dashClient = getDashClient();
			console.log('dashClient', !!dashClient);
			if (!dashClient) {
				return;
			}

			// init config;
			dashClient.send(jstr({ source: 'server', type: DASH_CALL_TYPES.dash_setConfigType, data: message.data }));
			console.log('handleBoxMessage box_get_config message', message);
		} else if (message.type === BOX_CALL_TYPES.box_getDevicesInfoType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}
			// get devices infos
			console.log('box_get_devices_infos message', message);
		} else if (message.type === BOX_CALL_TYPES.box_updateConfigType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}
			// get devices infos
			console.log('box_update_config', message);
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

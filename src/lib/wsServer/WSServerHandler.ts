import type { WebSocketServer as WebsocketServerType } from 'ws';
import { BOX_CALL_TYPES, DASH_CALL_TYPES } from '../wsGlobal/callTypes';
import type { ExtendedWebSocket, ParsedSocketMessage } from './wsServer';
import { jstr, parseMessage } from '../wsGlobal/wsUtils';

function WSServerHandler(webSocketServer: WebsocketServerType) {
	const wss = webSocketServer;

	function getBoxClient() {
		return [...(wss.clients as Set<ExtendedWebSocket>)].find((client) => client.source === 'box');
	}

	function getDashClient() {
		return [...(wss.clients as Set<ExtendedWebSocket>)].find((client) => client.source === 'dash');
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
		} else if (message.type === DASH_CALL_TYPES.dash_restartType) {
			const boxClient = getBoxClient();
			if (!boxClient) {
				return;
			}

			boxClient.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_restartType }));
		} else if (message.type === DASH_CALL_TYPES.dash_getConfigType) {
			const boxClient = getBoxClient();
			if (!boxClient) {
				return;
			}

			boxClient.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_getConfigType }));
		} else if (message.type === DASH_CALL_TYPES.dash_updateConfigType) {
			const boxClient = getBoxClient();
			if (!boxClient) {
				return;
			}

			boxClient.send(
				jstr({ source: 'server', type: BOX_CALL_TYPES.box_updateConfigType, data: message.data })
			);
		} else if (message.type === DASH_CALL_TYPES.dash_toggleDeviceType) {
			const boxClient = getBoxClient();
			if (!boxClient) {
				return;
			}

			boxClient.send(
				jstr({ source: 'server', type: BOX_CALL_TYPES.box_deviceToggleType, data: message.data })
			);
		} else if (message.type === DASH_CALL_TYPES.dash_toggleScheduleType) {
			const boxClient = getBoxClient();
			if (!boxClient) {
				return;
			}

			boxClient.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_scheduleToggleType }));
		}
	}

	function handleBoxMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
		console.log('handle box message TYPE', message.type, message.data);
		if (message.type === BOX_CALL_TYPES.box_handShakeType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			socket.source = 'box';
			socket.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_initType }));
			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_handShakeType,
					data: message.data,
					status: message.status
				})
			);
		} else if (message.type === BOX_CALL_TYPES.box_getConfigType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			// init config;
			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_setConfigType,
					data: message.data,
					status: message.status
				})
			);
			console.log('handleBoxMessage box_get_config message', message);
		} else if (message.type === BOX_CALL_TYPES.box_getDevicesInfoType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}
			// get devices infos
			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_setDevicesInfoType,
					data: message.data,
					status: message.status
				})
			);
			console.log('box_get_devices_infos message', message);
		} else if (message.type === BOX_CALL_TYPES.box_updateConfigType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}
			// get devices infos
			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_resultUpdateConfigType,
					data: message.data,
					status: message.status
				})
			);
			console.log('box_update_config', message);
		} else if (message.type === BOX_CALL_TYPES.box_restartType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_resultBoxRestartType,
					data: message.data,
					status: message.status
				})
			);
			console.log('box_restart', message);
		} else if (message.type === BOX_CALL_TYPES.box_deviceToggleType) {
			console.log(
				'RRECEIVEEDDD BOX_CALL_TYPES.box_deviceToggleType',
				BOX_CALL_TYPES.box_deviceToggleType
			);
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_resultToggleDeviceType,
					data: message.data,
					status: message.status,
					info: message.info || null
				})
			);
			console.log('box_device_manual_toggle', message);
		} else if (message.type === BOX_CALL_TYPES.box_scheduleToggleType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_resultToggleScheduleType,
					data: message.data,
					status: message.status
				})
			);
			console.log('box_schedule_toggle', message);
		} else if (message.type === BOX_CALL_TYPES.box_getScheduleStateType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_resultGetScheduleStateType,
					data: message.data,
					status: message.status
				})
			);
		} else if (message.type === BOX_CALL_TYPES.box_resultUpdateConfigType) {
			const dashClient = getDashClient();
			if (!dashClient) {
				return;
			}

			dashClient.send(
				jstr({
					source: 'server',
					type: DASH_CALL_TYPES.dash_resultUpdateConfigType,
					data: message.data,
					status: message.status
				})
			);
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

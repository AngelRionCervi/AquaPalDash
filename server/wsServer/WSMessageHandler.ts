import type { WebSocketServer as WebsocketServerType } from 'ws';
import { BOX_CALL_TYPES, DASH_CALL_TYPES } from '../wsGlobal/callTypes';
import type { ExtendedWebSocket, ParsedSocketMessage } from './wsServer';
import { jstr, parseMessage } from '../wsGlobal/wsUtils';
import { getBoxIdWithUserId, getUserIdWithBoxId, getUserWithPass } from './utils';

type ValueOf<T> = T[keyof T];

function WSServerHandler(webSocketServer: WebsocketServerType) {
  const wss = webSocketServer;

  function getBoxClient(userId: string) {
    return [...(wss.clients as Set<ExtendedWebSocket>)].find((client) => client.source === 'box' && client.boxId === getBoxIdWithUserId(userId));
  }

  function getDashClient(boxId: string) {
    return [...(wss.clients as Set<ExtendedWebSocket>)].find((client) => client.source === 'dash' && client.userId === getUserIdWithBoxId(boxId));
  }

  function sendToDash(dashClient: ExtendedWebSocket, callType: ValueOf<typeof DASH_CALL_TYPES>, message: ParsedSocketMessage) {
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

  function sendToBox(boxClient: ExtendedWebSocket, callType: ValueOf<typeof BOX_CALL_TYPES>, data: string | number | boolean | null = null) {
    boxClient.send(
      jstr({
        source: 'server',
        type: callType,
        data
      })
    );
  }

  function handleDashMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
    console.log('handle dash message TYPE', message.type, message);

    if (message.type === DASH_CALL_TYPES.dash_handShakeType) {
      socket.source = 'dash';
      socket.userId = getUserWithPass(message.data?.toString())?.userId;
      socket.send(jstr({ source: 'server', type: DASH_CALL_TYPES.dash_setUserIdType, data: socket.userId }));
    }
    const boxClient = getBoxClient(socket.userId?.toString() || '');
    if (!boxClient) {
      console.error('No box client found !');
      return;
    }

    switch (message.type) {
      case DASH_CALL_TYPES.dash_handShakeType:
        console.log('DASH_CALL_TYPES.dash_handShakeType', DASH_CALL_TYPES.dash_handShakeType);
        sendToBox(boxClient, BOX_CALL_TYPES.box_handShakeType);
        break;
      case DASH_CALL_TYPES.dash_restartType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_restartType);
        break;
      case DASH_CALL_TYPES.dash_getConfigType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_getConfigType);
        break;
      case DASH_CALL_TYPES.dash_updateConfigType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_updateConfigType, message.data);
        break;
      case DASH_CALL_TYPES.dash_toggleDeviceType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_deviceToggleType, message.data);
        break;
      case DASH_CALL_TYPES.dash_toggleScheduleType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_scheduleToggleType);
        break;
      case DASH_CALL_TYPES.dash_monitoringGetLastType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_monitoringGetLastType);
        break;
      case DASH_CALL_TYPES.dash_monitoringGetHistoricalType:
        sendToBox(boxClient, BOX_CALL_TYPES.box_monitoringGetHistoricalType, message.data);
        break;
    }
  }

  function handleBoxMessage(socket: ExtendedWebSocket, message: ParsedSocketMessage) {
    if (message.type === BOX_CALL_TYPES.box_handShakeType) {
      socket.source = 'box';
      socket.boxId = message.boxId.toString();
    }
    const dashClient = getDashClient(socket.boxId?.toString() || '');
    if (!dashClient) {
      console.error('No dash client found !');
      return;
    }

    switch (message.type) {
      case BOX_CALL_TYPES.box_handShakeType:
        socket.send(jstr({ source: 'server', type: BOX_CALL_TYPES.box_initType }));
        sendToDash(dashClient, DASH_CALL_TYPES.dash_handShakeType, message);
        break;
      case BOX_CALL_TYPES.box_getConfigType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_setConfigType, message);
        console.log('SEND SET CONFIG')
        break;
      case BOX_CALL_TYPES.box_getDevicesInfoType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_setDevicesInfoType, message);
        break;
      case BOX_CALL_TYPES.box_updateConfigType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultUpdateConfigType, message);
        break;
      case BOX_CALL_TYPES.box_restartType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultBoxRestartType, message);
        break;
      case BOX_CALL_TYPES.box_deviceToggleType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultToggleDeviceType, message);
        break;
      case BOX_CALL_TYPES.box_scheduleToggleType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultToggleScheduleType, message);
        break;
      case BOX_CALL_TYPES.box_getScheduleStateType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultGetScheduleStateType, message);
        break;
      case BOX_CALL_TYPES.box_resultUpdateConfigType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultUpdateConfigType, message);
        break;
      case BOX_CALL_TYPES.box_monitoringGetLastType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultMonitoringGetLastType, message);
        break;
      case BOX_CALL_TYPES.box_monitoringGetHistoricalType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultMonitoringGetHistoricalType, message);
        break;
      case BOX_CALL_TYPES.box_monitoringGetLiveType:
        sendToDash(dashClient, DASH_CALL_TYPES.dash_resultMonitoringGetLiveType, message);
        break
    }
  }

  function handleBoxHistoricalStartEnd(socket: ExtendedWebSocket, message: string, startEnd: 'start' | 'end') {
    const dashClient = getDashClient(socket.boxId?.toString() || '');
    if (!dashClient) {
      console.error('[handleBoxHistoricalStartEnd] No dash client found !');
      return;
    }

    const type = startEnd === 'start' ? DASH_CALL_TYPES.dash_startHistoricalType : DASH_CALL_TYPES.dash_endHistoricalType;
    const stripMessage = message.replace(type, '');

    const payload: ParsedSocketMessage = {
      data: stripMessage
    };

    sendToDash(dashClient, type, payload);
  }

  function handleBoxHistoricalStream(socket: ExtendedWebSocket, message: string) {
    const dashClient = getDashClient(socket.boxId?.toString() || '');
    if (!dashClient) {
      console.error('[handleBoxHistoricalRow] No dash client found !');
      return;
    }

    const stripMessage = message.replace(`${BOX_CALL_TYPES.box_historicalDataStreamType}_`, '');

    const payload: ParsedSocketMessage = {
      data: stripMessage
    };

    sendToDash(dashClient, DASH_CALL_TYPES.dash_historicalDataStreamType, payload);
  }

  return function (socket: ExtendedWebSocket, rawData: string) {
    if (!rawData) return;

    const data = rawData.toString();

    if (data.startsWith(BOX_CALL_TYPES.box_startHistoricalType)) {
      console.log('SERVER HISTORICAL DATA', data);
      handleBoxHistoricalStartEnd(socket, data, 'start');
      return;
    }

    if (data.startsWith(BOX_CALL_TYPES.box_historicalDataStreamType)) {
      console.log('SERVER HISTORICAL DATA ROW', data);
      handleBoxHistoricalStream(socket, data);
      return;
    }

    if (data.startsWith(BOX_CALL_TYPES.box_endHistoricalType)) {
      console.log('SERVER END HISTORICAL', data);
      handleBoxHistoricalStartEnd(socket, data, 'end');
      return;
    }

    const parsedData = parseMessage(data);
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
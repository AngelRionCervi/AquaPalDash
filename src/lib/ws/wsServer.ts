import type { ViteDevServer } from 'vite';
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import ShortUniqueId from 'short-unique-id';
import type { WebSocketServer as WebsocketServerType, WebSocket as WebSocketBase } from 'ws';

export type SocketSource = 'dash' | 'box';

export type ParsedSocketMessage = Record<string, string | number | boolean>;

export interface ExtendedWebSocket extends WebSocketBase {
	socketId: string;
	source: SocketSource;
}

const uuid = new ShortUniqueId({ length: 14 });

let wss: WebsocketServerType;

function onHttpServerUpgrade(req: IncomingMessage, sock: Duplex, head: Buffer) {
	if (req.url !== '/websocket') return;

	wss.handleUpgrade(req, sock, head, (ws) => {
		console.log('[handleUpgrade] creating new connection');
		wss.emit('connection', ws, req);
	});
}

function getBoxClient(id: string) {
	return [...wss.clients].find((client) => client.source === 'box' && client.socketId === id);
}

function getDashClient(id: string) {
	return [...wss.clients].find((client) => client.source === 'dash' && client.socketId === id);
}

function parseMessage(data: string) {
	try {
		return JSON.parse(data);
	} catch (err) {
		console.error(`Couldn't parse message ${err}`);
	}
}

function handleDashMessage(socket: ExtendedWebSocket, data: ParsedSocketMessage) {
	if (data.type === 'dash_handshake') {
		const boxClient = getBoxClient(socket.socketId);
		if (!boxClient) {
			return;
		}

		boxClient.send(JSON.stringify({ source: 'server', type: 'box_init' }));
	}
}

function handleBoxMessage(socket: ExtendedWebSocket, data: ParsedSocketMessage) {


	if (data.type === 'box_handshake') {
		socket.source = 'box';
		socket.send(JSON.stringify({ source: 'server', type: 'box_init' }));
	} else if (data.type === 'box_get_config') {
    const dashClient = getDashClient(socket.socketId);
    if (!dashClient) {
      return;
    }

		// init config;
		console.log('box_get_config DATA', data);
	} else if (data.type === 'box_get_devices_infos') {
    const dashClient = getDashClient(socket.socketId);
    if (!dashClient) {
      return;
    }
		// get devices infos
		console.log('box_get_devices_infos DATA', data);
	}
}

export function configureServer(server: ViteDevServer) {
	wss = new WebSocketServer({
		noServer: true
	});

	wss.on('connection', (socket: ExtendedWebSocket) => {
		socket.socketId = uuid.randomUUID();
		socket.on('message', (data: string) => {
			console.log('MESSAGE data', data, data.toString(), socket.bufferedAmount);
			const parsedData = parseMessage(data.toString());
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
      
		});
    socket.on('error', (err) => {
      console.error('Socket error', err);
    });
	});

	server.httpServer?.on('upgrade', onHttpServerUpgrade);
}

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer
};

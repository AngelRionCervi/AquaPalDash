import type { ViteDevServer } from 'vite';
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import ShortUniqueId from 'short-unique-id';
import type { WebSocketServer as WebsocketServerType, WebSocket as WebSocketBase } from 'ws';

export type SocketSource = 'dash' | 'box';

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

export function configureServer(server: ViteDevServer) {
	wss = new WebSocketServer({
		noServer: true
	});

	wss.on('connection', (socket: ExtendedWebSocket) => {
		socket.socketId = uuid.randomUUID();
		socket.on('message', (data: string) => {
			console.log('MESSAGE data', data);
			try {
				const parsedData = JSON.parse(data);
				console.log('parsedData', parsedData);
				if (parsedData.source === 'dash') {
					if (parsedData.type === 'handshake') {
						const boxClient = [...wss.clients].find((client) => client.source === 'box');

						console.log('boxClient', !!boxClient);
						boxClient?.send(JSON.stringify({ source: 'server', type: 'init' }));
					}
				} else if (parsedData.source === 'box') {
					// need to specify its form box
					if (parsedData.type === 'handshake') {
						// send data to dash
						socket.source = 'box';
					}
				}
			} catch (e) {
				console.error(e);
			}

			// smth like that
			// externalize the logic
			// const [message, rawData] = data.toString().split('_');
			// if (!message || !rawData) {
			//   return;
			// }
			// const parsedData = JSON.parse(rawData);
			// if (message.startsWith('initDash_')) {
			//   socket.source = 'dash';
			//   socket.socketId = parsedData.socketId;
			//   return;
			// }

			// if (message.startsWith('initBox_')) {
			//   socket.source = 'box';
			//   socket.socketId = parsedData.socketId;
			//   return;
			// }

			// if (message.startsWith('fullConfig_')) {
			// 	// send config to client
			// 	// socket is either the dashboard or the box, we need to link both (not for the moment lol)
			// 	// format message like this:
			// 	// {source}_{function}_{data}
			//   return
			// }
		});

		//socket.send('test from server');
	});

	server.httpServer?.on('upgrade', onHttpServerUpgrade);
}

export const webSocketServer = {
	name: 'webSocketServer',
	configureServer
};

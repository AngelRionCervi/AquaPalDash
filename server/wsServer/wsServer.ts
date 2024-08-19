import type { ViteDevServer } from 'vite';
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import ShortUniqueId from 'short-unique-id';
import type { WebSocketServer as WebsocketServerType, WebSocket as WebSocketBase } from 'ws';
import WSServerHandler from './WSServerHandler';

export type SocketSource = 'dash' | 'box';

export type ParsedSocketMessage = Record<string, string | number | boolean>;

export interface ExtendedWebSocket extends WebSocketBase {
	socketId: string;
	source: SocketSource;
}

const uuid = new ShortUniqueId({ length: 14 });

let wss: WebsocketServerType;

function onHttpServerUpgrade(req: IncomingMessage, sock: Duplex, head: Buffer) {
	//if (req.url !== '/websocket') return;

	wss.handleUpgrade(req, sock, head, (ws) => {
		console.log('[handleUpgrade] creating new connection');
		wss.emit('connection', ws, req);
	});
}

export function configureServer(server: any) {
	console.log('Starting websocket server...');
	wss = new WebSocketServer({
		server,
		path: '/websocket'
	});
  console.log(`websocket server started on: ${wss.address()}`);

	const messageHandler = WSServerHandler(wss);

	wss.on('connection', (socket: ExtendedWebSocket) => {
		socket.socketId = uuid.randomUUID();
		console.log('New connection !', socket.socketId);
		socket.on('message', (data: string) => {
			messageHandler(socket, data);
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

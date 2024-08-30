import type { ViteDevServer } from 'vite';
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';
import ShortUniqueId from 'short-unique-id';
import type { WebSocketServer as WebsocketServerType, WebSocket as WebSocketBase } from 'ws';
import WSMessageHandler from './WSMessageHandler';

export type SocketSource = 'dash' | 'box';

export type ParsedSocketMessage = Record<string, string | number | boolean>;

export interface ExtendedWebSocket extends WebSocketBase {
  socketId: string;
  source: SocketSource;
  boxId?: string;
  userId?: string;
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

export function configureWSServer(server) {
  console.log('Starting websocket server...');
  wss = new WebSocketServer({
    server,
    path: '/websocket'
  });

  const messageHandler = WSMessageHandler(wss);

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

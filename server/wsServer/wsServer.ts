import { WebSocketServer } from 'ws';
import ShortUniqueId from 'short-unique-id';
import type { WebSocket as WebSocketBase } from 'ws';
import WSMessageHandler from './WSMessageHandler';
import http from 'http';
import https from 'https';

export type SocketSource = 'dash' | 'box';

export type ParsedSocketMessage = Record<string, string | number | boolean>;

export interface ExtendedWebSocket extends WebSocketBase {
  socketId: string;
  source: SocketSource;
  boxId?: string;
  userId?: string;
}

const uuid = new ShortUniqueId({ length: 14 });

export function configureWSServer(server: http.Server | https.Server) {
  console.log('Starting websocket server...');
  const wss = new WebSocketServer({
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
}

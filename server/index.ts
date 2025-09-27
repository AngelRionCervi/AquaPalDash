import { configureWSServer } from './wsServer/wsServer';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import config from 'config';

(async () => {
  const port = config.get<number>('wsServer.port');
  const app = express();
  let server: http.Server | https.Server;

  if (process.env.NODE_ENV === 'production') {
    const handler = (await import('../build/handler.js')).handler;
    app.use(handler);
    server = http.createServer(app);
  } else {
    const key = fs.readFileSync('cert/dev.pem', 'utf-8');
    const cert = fs.readFileSync('cert/cert.pem', 'utf-8');
    server = https.createServer({ key, cert }, app);
  }

  configureWSServer(server);
  server.listen(port);
})();

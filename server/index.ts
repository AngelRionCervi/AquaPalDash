import { configureServer } from './wsServer/wsServer';
import express from 'express';
import { createServer } from 'http';
import fs from 'fs';
import https from 'https';

(async () => {
  const port = 3000;
  const app = express();

  if (process.env.NODE_ENV === 'production') {
    const handler = (await import('../build/handler.js')).handler;
    app.use(handler);
    const server = createServer(app);
    configureServer(server);
    server.listen(port);
  } else {
    const key = fs.readFileSync('cert/dev.pem', 'utf-8');
    const cert = fs.readFileSync('cert/cert.pem', 'utf-8');
    const server = https.createServer({ key, cert }, app);
    configureServer(server);
    server.listen(port);
  }
})();

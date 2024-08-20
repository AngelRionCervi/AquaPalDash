import { configureServer } from './wsServer/wsServer';
import express from 'express';
import { createServer } from 'http';

(async () => {
    const port = 3000;
    const app = express();
    const server = createServer(app);
    
    configureServer(server);

    if (process.env.NODE_ENV === 'production') {
        const handler = (await import('../build/handler.js')).handler;
        app.use(handler);
    }
    
    server.listen(port);
})()



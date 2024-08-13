import { configureServer } from './wsServer/wsServer';
import express from 'express'
import { createServer } from 'http'

import { handler } from '../build/handler.js'

const port = 3000
const app = express()
const server = createServer(app)

configureServer(server);

app.use(handler)

server.listen(port)

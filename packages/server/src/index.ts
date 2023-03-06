import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { Server as SocketIO, Socket } from 'socket.io'
import { createLogger } from './logger'
dotenv.config()

const logger = createLogger(
    process.env.NODE_ENV !== 'production' ? 'DEV' : 'PROD'
)

const app = express()
const server = createServer(app)
const io = new SocketIO(server)
const port = process.env.PORT || 3000

// REST
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use(express.static(path.join(__dirname, 'public')))

// Socket IO
io.on('connection', (socket: Socket) => {
    logger.debug(`Socket connection ${socket.id}`)

    socket.on('disconnect', () => {
        logger.debug(`Socket disconnect ${socket.id}`)
    })
})

// Server
server.listen(port, () => {
    logger.info(`listening on port ${port}`)
})

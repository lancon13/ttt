import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { Server as SocketIO, Socket } from 'socket.io'
import { listGames, newGame } from './game'
import { createLogger } from './logger'
import { ListGameClientData, NewGameClientData } from './types'
dotenv.config()

const logger = createLogger(process.env.NODE_ENV !== 'production' ? 'DEV' : 'PROD')

const app = express()
const server = createServer(app)
const io = new SocketIO(server, {
    path: '/ttt-socket',
})
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

    // Handle the message event from
    socket.on(
        'client:data',
        ({ type, params }: NewGameClientData | ListGameClientData, callback: (_error: Error | null, _params?: unknown) => void) => {
            switch (type) {
                case 'newGame':
                    newGame(params)
                        .then((res) => {
                            callback(null, res)
                            logger.debug(`New Game "${res.gameId}" created successfully`)
                            io.emit('server:data', {
                                type: 'newGameCreated',
                                params: { gameId: res.gameId },
                            })
                        })
                        .catch((error) => {
                            callback(error)
                        })
                    return

                case 'listGames':
                    listGames(params)
                        .then((res) => {
                            callback(null, res)
                        })
                        .catch((error) => {
                            callback(error)
                        })
                    return

                default:
                    callback(new Error(`Invalid data type "${type}"`))
                    return
            }
        }
    )
})

// Server
server.listen(port, () => {
    logger.info(`listening on port ${port}`)
})

import { User } from '@ttt/lib'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import path from 'path'
import { Server as SocketIO, Socket } from 'socket.io'
import { getGame, joinGame, listGames, listUsers, moveGame, newGame, quitGame, registerUser, unregisterUser } from './game'
import { createLogger } from './logger'
import { ClientData, GetGameClientData, JoinGameClientData, MoveGameClientData, NewGameClientData, QuitGameClientData } from './types'
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
    const user = (() => {
        try {
            return JSON.parse(socket.handshake.query.user as string) as unknown as User
        } catch (error) {
            return { uid: '', name: '' }
        }
    })()
    logger.debug(`Socket connection "${socket.id}" with user "${user?.uid}:${user?.name}"`)
    registerUser(user)

    socket.on('disconnect', () => {
        unregisterUser(user)
        logger.debug(`Socket disconnect "${socket.id}" with user "${user?.uid}:${user?.name}"`)
    })

    // Handle the message event from
    socket.on('client:data', ({ type, params }: ClientData, callback: (_error: Error | null, _params?: unknown) => void) => {
        switch (type) {
            case 'joinGame':
                {
                    const { gameId, asPlayer } = params as JoinGameClientData['params']
                    joinGame(gameId, user, asPlayer)
                    const gameState = getGame(gameId)
                    callback(null, gameState)
                    logger.debug(`${user.uid}:${user.name} Join Game "${gameId}" as ${asPlayer ? 'PLAYER' : 'OPPONENT'} successfully`)

                    // Game Broadcast
                    socket.join(gameId)
                    io.emit('server:data', {
                        type: 'gameJoined',
                        params: { gameId },
                    })
                }
                return

            case 'quitGame':
                {
                    const { gameId, asPlayer } = params as QuitGameClientData['params']
                    quitGame(gameId, user, asPlayer)
                    callback(null)
                    logger.debug(`${user.uid}:${user.name} Quit Game "${gameId}" successfully`)

                    // Broadcast
                    socket.leave(gameId)
                    io.emit('server:data', {
                        type: 'gameQuitted',
                        params: { gameId },
                    })
                }
                return

            case 'listUsers':
                {
                    callback(null, listUsers())
                }
                return

            case 'moveGame':
                {
                    const { gameId, position } = params as MoveGameClientData['params']
                    moveGame(gameId, user, position)
                    const gameState = getGame(gameId)
                    callback(null, gameState)
                    logger.debug(`${user.uid}:${user.name} Moved Game "${gameId}" on Position "${position.x}:${position.y}" successfully`)

                    // Game Broadcast
                    io.to(gameId).emit('game:data', {
                        type: 'gameMoved',
                        params: { gameId, gameState },
                    })
                    io.emit('server:data', {
                        type: 'gameMoved',
                        params: { gameId, gameState },
                    })
                }
                return

            case 'newGame':
                {
                    const gameId = newGame(params as NewGameClientData['params'])
                    callback(null, gameId)
                    logger.debug(`New Game "${gameId}" created successfully`)

                    // Broadcast
                    io.emit('server:data', {
                        type: 'gameCreated',
                        params: { gameId },
                    })
                }
                return

            case 'getGame':
                {
                    const { gameId } = params as GetGameClientData['params']
                    const gameState = getGame(gameId)
                    callback(null, gameState)
                }
                return

            case 'listGames':
                {
                    callback(null, listGames())
                }
                return

            default:
                callback(new Error(`Invalid data type "${type}"`))
                return
        }
    })
})

// Server
server.listen(port, () => {
    logger.info(`listening on port ${port}`)
})

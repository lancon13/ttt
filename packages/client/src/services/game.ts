import { CellState, GameState } from '@ttt/lib'
import { EventEmitter } from 'eventemitter3'
import { io, Socket } from 'socket.io-client'
import { ServerData } from '../types'

export const createGameClient = () => {
    const eventEmitter = new EventEmitter()
    let socket: Socket | undefined
    const connect = () => {
        if (socket) disconnect()
        socket = io({
            path: '/ttt-socket',
        })
        socket.on('connect', (...args) => eventEmitter.emit('connect', ...args))
        socket.on('disconnect', (...args) => eventEmitter.emit('disconnect', ...args))
        socket.on('connect_error', (...args) => eventEmitter.emit('connect_error', ...args))
        socket.on('server:data', (params: ServerData) => {
            eventEmitter.emit('server:data', params)
        })
    }
    const disconnect = () => {
        if (socket) {
            eventEmitter.removeAllListeners()
            socket.off()
            socket.close()
        }
        socket = undefined
    }

    const newGame = async ({ size, numInRow }: { size: number; numInRow: number }): Promise<{ gameId: string }> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'newGame',
                    params: {
                        size,
                        numInRow,
                    },
                },
                (error: Error | null, { gameId }: { gameId: string }) => {
                    if (error) reject(error)
                    else resolve({ gameId })
                }
            )
        })
    }

    const getGame = async ({ gameId }: { gameId: string }): Promise<GameState> => {
        return {
            cells: [],
            numInRow: 0,
            turn: CellState.PLAYER,
            player: undefined,
            opponent: undefined,
        }
    }

    const listGames = async (): Promise<Map<string, GameState>> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'listGames',
                    params: {},
                },
                (error: Error | null, games: { [key: string]: GameState }) => {
                    if (error) reject(error)
                    else resolve(new Map(Object.entries(games)))
                }
            )
        })
        return new Map()
    }

    return {
        connect,
        disconnect,
        eventEmitter,

        newGame,
        getGame,
        listGames,
    }
}

import { GameState, Position, User } from '@ttt/lib'
import { EventEmitter } from 'eventemitter3'
import { io, Socket } from 'socket.io-client'
import { GameData, ServerData } from '../types'

export const createGameClient = () => {
    const eventEmitter = new EventEmitter()
    let socket: Socket | undefined

    const connect = (user: User) => {
        if (socket) disconnect()
        socket = io({
            path: '/ttt-socket',
            query: {
                user: JSON.stringify(user),
            },
            forceNew: false
        })
        socket.on('connect', async (...args) => {
            eventEmitter.emit('connect', ...args)
            try {
                eventEmitter.emit('listGames', await listGames())
            } catch (error) {
                eventEmitter.emit('error', error)
            }
        })
        socket.on('disconnect', async (...args) => {
            eventEmitter.emit('disconnect', ...args)
        })
        socket.on('connect_error', (...args) => eventEmitter.emit('connect_error', ...args))
        socket.on('server:data', async ({ type, params }: ServerData) => {
            eventEmitter.emit('server:data', { type, params })
            try {
                switch (type) {
                    case 'gameCreated':
                    case 'gameMoved':
                    case 'gameJoined':
                    case 'gameQuitted': {
                        eventEmitter.emit('listGames', await listGames())
                    }
                }
            } catch (error) {
                eventEmitter.emit('error', error)
            }
        })
        socket.on('game:data', async ({ type, params }: GameData) => {
            eventEmitter.emit('game:data', { type, params })
            try {
                switch (type) {
                    case 'gameMoved':
                    {
                        eventEmitter.emit('refreshGame', { gameState: params.gameState })
                    }
                }
            } catch (error) {
                eventEmitter.emit('error', error)
            }
        })
    }

    const disconnect = () => {
        if (socket) {
            socket.off()
            socket.close()
        }
        socket = undefined
    }

    const newGame = async ({ size, numInRow }: { size: number; numInRow: number }): Promise<string> => {
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
                (error: Error | null, gameId: string) => {
                    if (error) reject(error)
                    else resolve(gameId)
                }
            )
        })
    }

    const getGame = async (gameId: string): Promise<GameState> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'getGame',
                    params: {
                        gameId,
                    },
                },
                (error: Error | null, gameState: GameState) => {
                    if (error) reject(error)
                    else resolve(gameState)
                }
            )
        })
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
                (error: Error | null, games: { gameId: string; gameState: GameState }[]) => {
                    if (error) reject(error)
                    else
                        resolve(
                            games.reduce((gamesMap, game) => {
                                gamesMap.set(game.gameId, game.gameState)
                                return gamesMap
                            }, new Map())
                        )
                }
            )
        })
    }

    const joinGame = async ({ gameId, asPlayer }: { gameId: string; asPlayer: boolean }): Promise<GameState> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error('Connection is not established yet.'))
            console.log('join')

            socket.emit(
                'client:data',
                {
                    type: 'joinGame',
                    params: {
                        gameId,
                        asPlayer,
                    },
                },
                (error: Error | null, gameState: GameState) => {
                    if (error) reject(error)
                    else resolve(gameState)
                }
            )
        })
    }

    const quitGame = async ({ gameId, asPlayer }: { gameId: string; asPlayer: boolean }): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'quitGame',
                    params: {
                        gameId,
                        asPlayer
                    },
                },
                (error: Error | null) => {
                    if (error) reject(error)
                    else resolve()
                }
            )
        })
    }

    const moveGame = async ({ gameId, position }:{ gameId:string, position:Position}): Promise<GameState> => {
        return new Promise((resolve, reject) => {
            if (!socket || !socket.connected) return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'moveGame',
                    params: {
                        gameId,
                        position
                    },
                },
                (error: Error | null, gameState:GameState) => {
                    if (error) reject(error)
                    else resolve(gameState)
                }
            )
        })
    }

    return {
        connect,
        disconnect,
        eventEmitter,

        newGame,
        getGame,
        listGames,

        joinGame,
        quitGame,
        moveGame,
    }
}

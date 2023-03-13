import { GameState, Position, User } from '@ttt/lib'
import EventEmitter from 'eventemitter3'
import { io, Socket } from 'socket.io-client'
import { debounce } from '../helpers'
import { ServerData } from '../types'

export const createConnection = () => {

    const eventEmitter = new EventEmitter()
    let socket:Socket|undefined = undefined

    const connect = debounce((user:User) => {
        socket = io({
            path: '/ttt-socket',
            query: {
                user: JSON.stringify(user),
            },
            upgrade:true
        })
        socket.on('connect', () => {
            eventEmitter.emit('connect')
        })
        socket.on('disconnect', () => {
            eventEmitter.emit('disconnect')
        })
        socket.on('connection_error', (error:Error) => {
            eventEmitter.emit('error', error)
        })
        socket.on('server:data', async (params:ServerData)=>{
            console.log(params)
            try {
                switch(params.type) {
                    case 'gameCreated':
                    case 'gameJoined':
                    case 'gameQuitted':
                    case 'gameMoved':
                        {
                            const games = await listGames()
                            eventEmitter.emit('listGames', games)
                        }
                        break
                }
            } catch(error) {
                eventEmitter.emit('error', error as Error)
            }
        })
    }, 1)

    const disconnect = debounce(() => {
        if ( socket ) {
            socket.off()
            socket.close()
        }
        socket = undefined
    }, 1)

    const newGame = async (size:number, numInRow:number): Promise<{gameId:string, gameState:GameState}> => {
        return new Promise((resolve, reject)=>{
            if ( !socket )
                return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'newGame',
                    params: {
                        size,
                        numInRow,
                    },
                },
                (error: Error | null, params:{gameId: string, gameState:GameState}) => {
                    if (error) reject(error)
                    else resolve(params)
                }
            )
        })
    }

    const getGame = async (gameId:string): Promise<{gameId:string, gameState:GameState}> => {
        return new Promise((resolve, reject)=>{
            if ( !socket )
                return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'getGame',
                    params: {
                        gameId
                    },
                },
                (error: Error | null, params:{gameId: string, gameState:GameState}) => {
                    if (error) reject(error)
                    else resolve(params)
                }
            )
        })
    }

    const listGames = async (): Promise<{gameId:string, gameState:GameState}[]> => {
        return new Promise((resolve, reject)=>{
            if ( !socket )
                return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'listGames',
                    params: {
                    },
                },
                (error: Error | null, params:{gameId: string, gameState:GameState}[]) => {
                    if (error) reject(error)
                    else resolve(params)
                }
            )
        })

    }

    const joinGame = async (gameId:string, asPlayer:boolean): Promise<{gameId:string, gameState:GameState}> => {
        return new Promise((resolve, reject)=>{
            if ( !socket )
                return reject(new Error('Connection is not established yet.'))
            console.log(gameId, asPlayer)
            socket.emit(
                'client:data',
                {
                    type: 'joinGame',
                    params: {
                        gameId,
                        asPlayer
                    },
                },
                (error: Error | null, params:{gameId: string, gameState:GameState}) => {
                    if (error) reject(error)
                    else resolve(params)
                }
            )
        })
    }
    const quitGame = async (gameId:string, asPlayer:boolean): Promise<{gameId:string, gameState:GameState}> => {
        return new Promise((resolve, reject)=>{
            if ( !socket )
                return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'quitGame',
                    params: {
                        gameId,
                        asPlayer
                    },
                },
                (error: Error | null, params:{gameId: string, gameState:GameState}) => {
                    if (error) reject(error)
                    else resolve(params)
                }
            )
        })
    }
    const moveGame = async (gameId:string, position:Position, asPlayer:boolean): Promise<{gameId:string, gameState:GameState}> => {
        return new Promise((resolve, reject)=>{
            if ( !socket )
                return reject(new Error('Connection is not established yet.'))
            socket.emit(
                'client:data',
                {
                    type: 'moveGame',
                    params: {
                        gameId,
                        position,
                        asPlayer
                    },
                },
                (error: Error | null, params:{gameId: string, gameState:GameState}) => {
                    if (error) reject(error)
                    else resolve(params)
                }
            )
        })
    }

    return {
        eventEmitter,
        connect,
        disconnect,

        newGame,
        getGame,
        listGames,
        joinGame,
        quitGame,
        moveGame
    }
}


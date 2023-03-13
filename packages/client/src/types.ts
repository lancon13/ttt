import { GameState, User } from '@ttt/lib'

export type ConnectionStatus = 'connected' | 'disconnected'

export interface SystemState {
    connectionStatus: ConnectionStatus

    isUserModalEnabled: boolean
}

export interface DataState {
    user: User,
    gameId: string | undefined
}

export interface ServerData {
    type: string
    params: { [key: string]: unknown }
}

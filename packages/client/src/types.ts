import { Game, GameState, User } from '@ttt/lib'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

export interface SystemState {
    isStartingNewGame: boolean
    isLoading: boolean

    connectionStatus: ConnectionStatus

    userModalVisible: boolean
    newGameModalVisible: boolean
}

export interface DataState {
    user: User,
    game: {
        gameId: string
        gameState: GameState,
        asPlayer: boolean
    } | undefined
}

export interface ServerData {
    type: string
    params: { [key: string]: unknown }
}
export interface GameData {
    type: string
    params: { [key: string]: unknown }
}


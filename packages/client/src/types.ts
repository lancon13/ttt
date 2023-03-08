import { User } from '@ttt/lib'

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

export interface SystemState {
    isStartingNewGame: boolean
    isLoading: boolean

    connectionStatus: ConnectionStatus

    userModalVisible: boolean
    newGameModalVisible: boolean
}

export interface DataState {
    user: User
}

export interface ServerData {
    type: string
    params: { [key: string]: unknown }
}

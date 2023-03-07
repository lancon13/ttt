export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting'

export interface SystemState {
    isStartingNewGame: boolean
    isLoading: boolean

    connectionStatus: ConnectionStatus

    usernameModalVisible: boolean
    newGameModalVisible: boolean
}

export interface DataState {
    userId: string
    username: string
}

export interface ServerData {
    type: string
    params: unknown
}

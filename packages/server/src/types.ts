import { Position, User } from '@ttt/lib'

export interface ClientData {
    type: string
    params: { [key: string]: unknown }
}

export interface JoinGameClientData extends ClientData {
    type: 'joinGame'
    params: {
        gameId: string
        asPlayer: boolean
    }
}

export interface QuitGameClientData extends ClientData {
    type: 'quitGame'
    params: {
        gameId: string
        asPlayer?: boolean
    }
}

export interface NewGameClientData extends ClientData {
    type: 'newGame'
    params: {
        size: number
        numInRow: number
    }
}

export interface GetGameClientData extends ClientData {
    type: 'moveGame'
    params: {
        user: User
        gameId: string
        position: Position
    }
}

export interface MoveGameClientData extends ClientData {
    type: 'moveGame'
    params: {
        gameId: string
        position: Position
    }
}

export interface NewGameClientData {
    type: 'newGame'
    params: {
        size: number
        numInRow: number
    }
}

export interface ListGameClientData {
    type: 'listGames'
    params: {}
}

export interface User {
    uid: string
    name: string
}

export interface GameState {
    player: User | undefined
    opponent: User | undefined
    cells: CellState[]
    turn: CellState.PLAYER | CellState.OPPONENT
    numInRow: number
}

export enum CellState {
    EMPTY = 0,
    PLAYER = 1,
    OPPONENT = 2,
}

export interface Position {
    x: number
    y: number
}

export interface Player {
    uid: string
    name: string
    scores: {
        w: number
        l: number
        t: number
    }
    isAI: boolean
}

export interface GameState {
    playerA: Player | undefined
    playerB: Player | undefined
    cells: CellState[]
}

export enum CellState {
    EMPTY = 0,
    PLAYER_A = 1,
    PLAYER_B = 2,
}

export interface Position {
    x: number,
    y: number
}
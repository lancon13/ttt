import { CellState, GameState } from '@ttt/lib'
import { v4 as uuid } from 'uuid'

const games = new Map<string, GameState>()

export const newGame = async ({ size, numInRow }: { size: number; numInRow: number }): Promise<{ gameId: string }> => {
    const gameId = uuid()
    games.set(gameId, {
        cells: Array(size ** 2).fill(CellState.EMPTY),
        numInRow,
        player: undefined,
        opponent: undefined,
        turn: CellState.PLAYER,
    })
    return { gameId }
}

export const listGames = async (_params: {}): Promise<{ [key: string]: GameState }> => {
    return Array.from(games).reduce((obj, [key, gameState]) => {
        Object.assign(obj, { [key]: gameState })
        return obj
    }, {})
}

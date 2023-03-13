import { Game } from './game'
import { getNextMove } from './helpers'
import { CellState } from './types'

const game = new Game()
const cells = [
    CellState.PLAYER,
    CellState.EMPTY,
    CellState.PLAYER,
    CellState.OPPONENT,

    CellState.EMPTY,
    CellState.EMPTY,
    CellState.OPPONENT,
    CellState.PLAYER,

    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,
    CellState.EMPTY,

    CellState.OPPONENT,
    CellState.PLAYER,
    CellState.EMPTY,
    CellState.EMPTY,

    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,

    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
]

const move = getNextMove({
    index: -1,
    cells,
    size: 4,
    numInRow: 3,
    isMax: true,
})
console.log(move)

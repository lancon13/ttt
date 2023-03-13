import { findWinningIndexesCombination, listWinningCellIndexesCombinations } from './helpers'
import { CellState } from './types'

const cells = [
    CellState.PLAYER,
    CellState.OPPONENT,
    CellState.PLAYER,
    CellState.OPPONENT,

    CellState.PLAYER,
    CellState.OPPONENT,
    CellState.PLAYER,
    CellState.OPPONENT,

    CellState.OPPONENT,
    CellState.PLAYER,
    CellState.OPPONENT,
    CellState.PLAYER,

    CellState.OPPONENT,
    CellState.OPPONENT,
    CellState.PLAYER,
    CellState.PLAYER,
]
// console.log(listWinningCellIndexesCombinations(4, 3))
console.log(findWinningIndexesCombination(CellState.OPPONENT, cells, 4, 3))


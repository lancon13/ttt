import {
    findWinningIndexesCombination,
    getIndex,
    getNextMove,
    getPosition,
    listEmptyCellIndexes,
    listWinningCellIndexesCombinations,
} from './helpers'
import { CellState } from './types'

describe('helpers', () => {
    describe('listWinningCellIndexesCombinations()', () => {
        it('should list all winning cell indexes combinations', () => {
            // Some odd size and numInRow
            expect(listWinningCellIndexesCombinations(2, 3)).toEqual([])
            expect(listWinningCellIndexesCombinations(-1, 3)).toEqual([])
            expect(listWinningCellIndexesCombinations(4, 0)).toEqual([])

            // 3 x 3
            expect(listWinningCellIndexesCombinations(3, 3)).toEqual([
                [0, 4, 8],
                [6, 4, 2],
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
            ])
            expect(listWinningCellIndexesCombinations(3, 2)).toEqual([
                [0, 4],
                [6, 4],
                [0, 1],
                [3, 4],
                [6, 7],
                [0, 3],
                [1, 4],
                [2, 5],
                [4, 8],
                [4, 2],
                [1, 2],
                [4, 5],
                [7, 8],
                [3, 6],
                [4, 7],
                [5, 8],
            ])
        })
    })

    describe('listEmptyCellIndexes()', () => {
        it('should list all empty cell indexes', () => {
            expect(
                listEmptyCellIndexes([
                    CellState.EMPTY,
                    CellState.PLAYER,
                    CellState.PLAYER,
                    CellState.EMPTY,
                    CellState.EMPTY,
                    CellState.OPPONENT,
                    CellState.OPPONENT,
                    CellState.PLAYER,
                    CellState.OPPONENT,
                ])
            ).toEqual([0, 3, 4])
        })

    })

    describe('getIndex()', () => {
        it('should convert position to index', () => {
            expect(getIndex(3, { x: 0, y: 1 })).toEqual(3)
            expect(getIndex(3, { x: 2, y: 1 })).toEqual(5)
            expect(getIndex(3, { x: 2, y: 2 })).toEqual(8)
        })
    })

    describe('getPosition()', () => {
        it('should convert index to position', () => {
            expect(getPosition(3, 2)).toEqual({ x: 2, y: 0 })
            expect(getPosition(3, 4)).toEqual({ x: 1, y: 1 })
            expect(getPosition(3, 7)).toEqual({ x: 1, y: 2 })
        })
    })

    describe('findWinningIndexesCombination()', () => {
        it('should find winning indexes combination 3', () => {
            expect(
                findWinningIndexesCombination(
                    CellState.PLAYER,
                    [
                        CellState.EMPTY,
                        CellState.PLAYER,
                        CellState.PLAYER,
                        CellState.EMPTY,
                        CellState.EMPTY,
                        CellState.OPPONENT,
                        CellState.OPPONENT,
                        CellState.PLAYER,
                        CellState.OPPONENT,
                    ],
                    3,
                    3
                )
            ).toBeUndefined()

            expect(
                findWinningIndexesCombination(
                    CellState.PLAYER,
                    [
                        CellState.OPPONENT,
                        CellState.PLAYER,
                        CellState.PLAYER,

                        CellState.EMPTY,
                        CellState.PLAYER,
                        CellState.OPPONENT,

                        CellState.OPPONENT,
                        CellState.PLAYER,
                        CellState.PLAYER,
                    ],
                    3,
                    3
                )
            ).toEqual([1, 4, 7])
        })
    })

    xit('should find winning indexes combination 4', () => {
        expect(
            findWinningIndexesCombination(
                CellState.PLAYER,
                [
                    CellState.EMPTY,
                    CellState.PLAYER,
                    CellState.PLAYER,
                    CellState.EMPTY,

                    CellState.EMPTY,
                    CellState.PLAYER,
                    CellState.OPPONENT,
                    CellState.PLAYER,

                    CellState.OPPONENT,
                    CellState.PLAYER,
                    CellState.EMPTY,
                    CellState.EMPTY,

                    CellState.OPPONENT,
                    CellState.EMPTY,
                    CellState.EMPTY,
                    CellState.EMPTY,
                ],
                3,
                3
            )
        ).toEqual([1, 4, 7])
    })

    describe('getNextMove()', () => {
        it('should minmax simulation works as expected 3x3', () => {
            const cells = [
                CellState.EMPTY,
                CellState.PLAYER,
                CellState.OPPONENT,

                CellState.EMPTY,
                CellState.PLAYER,
                CellState.EMPTY,

                CellState.EMPTY,
                CellState.EMPTY, // <- block here [7]
                CellState.EMPTY,
            ]
            const move1 = getNextMove({
                index: -1,
                cells,
                size: 3,
                numInRow: 3,
                isMax: false,
            })
            expect(move1.index).toBe(7)
        })
    })
})

import { Game } from './game'
import { CellState } from './types'

describe('class Game', () => {
    it('should initialise the default Game instance', () => {
        const game = new Game()
        expect(game.size).toBe(3)
        expect(game.numInRow).toBe(3)
        expect(game.turn).toBe(CellState.PLAYER)
    })

    it('should initialise Game instance with parameters (size)', () => {
        const game = new Game({
            size: 4,
        })
        expect(game.size).toBe(4)
        expect(game.numInRow).toBe(4)
        expect(game.turn).toBe(CellState.PLAYER)
    })

    it('should initialise Game instance with parameters (size, numInRow)', () => {
        const game = new Game({
            size: 4,
            numInRow: 5, // This should fall back to 4
        })
        expect(game.size).toBe(4)
        expect(game.numInRow).toBe(4)
        expect(game.turn).toBe(CellState.PLAYER)
    })

    it('should set player, opponent, and turn works correctly ', () => {
        const game = new Game({})
        expect(game.player).toBeUndefined()
        expect(game.opponent).toBeUndefined()
        expect(game.turn).toBe(CellState.PLAYER)

        game.player = { name: 'A', uid: 'A' }
        game.opponent = { name: 'B', uid: 'B' }
        game.turn = CellState.OPPONENT

        expect(game.player).toEqual({ name: 'A', uid: 'A' })
        expect(game.opponent).toEqual({ name: 'B', uid: 'B' })
        expect(game.turn).toBe(CellState.OPPONENT)
    })

    it('should the getAt and setAT works correctly', () => {
        const game = new Game({})
        expect(game.getAt({ x: 1, y: 1 })).toBe(CellState.EMPTY)
        game.setAt({ x: 1, y: 1 }, CellState.PLAYER)
        expect(game.getAt({ x: 1, y: 1 })).toBe(CellState.PLAYER)
        game.clear()
        expect(game.getAt({ x: 1, y: 1 })).toBe(CellState.EMPTY)
    })

    it('should import works correctly', () => {
        const game = new Game()
        game.import({
            cells: [
                CellState.EMPTY,
                CellState.PLAYER,
                CellState.OPPONENT,
                CellState.PLAYER,

                CellState.EMPTY,
                CellState.PLAYER,
                CellState.OPPONENT,
                CellState.OPPONENT,

                CellState.EMPTY,
                CellState.EMPTY,
                CellState.OPPONENT,
                CellState.PLAYER,

                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
            ],
            player: { name: 'A', uid: 'A' },
            opponent: { name: 'B', uid: 'B' },
            turn: CellState.OPPONENT,
            numInRow: 3,
        })
        expect(game.size).toBe(4)
        expect(game.numInRow).toBe(3)
        expect(game.player).toEqual({ name: 'A', uid: 'A' })
        expect(game.opponent).toEqual({ name: 'B', uid: 'B' })
        expect(game.turn).toBe(CellState.OPPONENT)
    })

    it('should export works correctly', () => {
        const game = new Game({
            size: 2,
            numInRow: 2,
        })
        game.player = { name: 'A', uid: 'A' }
        game.opponent = { name: 'B', uid: 'B' }
        const exported = game.export()
        expect(exported).toEqual({
            player: { name: 'A', uid: 'A' },
            opponent: { name: 'B', uid: 'B' },
            cells: [
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
            ],
            turn: CellState.PLAYER,
            numInRow: 2,
        })
    })
})

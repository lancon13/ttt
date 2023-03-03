import { Game, generateWinningPositions, isFull, nextRandomEmptyPosition } from './game';
import { CellState, Player, Position } from './types';

describe('class Game', () => {
    let playerA: Player;
    let playerB: Player;

    beforeEach(() => {
        playerA = {
            uid: 'A',
            name: 'A',
            scores: { w: 0, l: 0, t: 0 },
            isAI: false,
        };
        playerB = {
            uid: 'B',
            name: 'B',
            scores: { w: 0, l: 0, t: 0 },
            isAI: false,
        };
    });
    it('should initialize default value', () => {
        const game = new Game(playerA, playerB);
        expect(game).toBeInstanceOf(Game);
        expect(game.size).toBe(3);
        expect(game.cells).toEqual([
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
        ]);
        expect(game.playerA).toBe(playerA);
        expect(game.playerB).toBe(playerB);
    });

    it('should getGameState() return the game state', () => {
        const game = new Game(playerA, playerB);
        expect(game.getGameState()).toEqual({
            playerA,
            playerB,
            cells: [
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
                CellState.EMPTY,
            ],
        });
    });

    it('should getCellState() and setCellState() working as expected', () => {
        const game = new Game(playerA, playerB);
        expect(game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_A)).toBeTruthy();
        expect(game.cells).toEqual([
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.PLAYER_A,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
        ]);
        expect(game.getCellState({ x: 1, y: 1 })).toBe(CellState.PLAYER_A);

        // Should blocked if the cell is already occupied
        expect(game.isCellEmpty({ x: 1, y: 1 })).toBeFalsy();
        expect(game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_B)).toBeFalsy();
        expect(game.getCellState({ x: 1, y: 1 })).toBe(CellState.PLAYER_A);
    });

    it('should reset() clear the game state', () => {
        const game = new Game(playerA, playerB);
        expect(game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_A)).toBeTruthy();
        game.reset();
        expect(game.cells).toEqual([
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
            CellState.EMPTY,
        ]);
    });

    it('should move() allow the current player to place on the cell', () => {
        const game = new Game(playerA, playerB);
        expect(game.current).toBe(CellState.PLAYER_A);
        game.move({ x: 0, y: 0 });
        expect(game.cells[0]).toBe(CellState.PLAYER_A);

        expect(game.current).toBe(CellState.PLAYER_B);
        game.move({ x: 1, y: 1 });
        expect(game.cells[4]).toBe(CellState.PLAYER_B);

        expect(game.current).toBe(CellState.PLAYER_A);
        game.move({ x: 2, y: 2 });
        expect(game.cells[8]).toBe(CellState.PLAYER_A);
    });

    it('should getWinner() return the winning player', () => {
        const game = new Game(playerA, playerB);

        // Horizontal
        game.setCellState({ x: 0, y: 1 }, CellState.PLAYER_A);
        expect(game.getWinner()).toBeUndefined();
        game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_A);
        game.setCellState({ x: 2, y: 1 }, CellState.PLAYER_A);
        expect(game.getWinner()).toEqual({
            positions: [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            player: playerA,
        });
        game.reset();

        // Vertical
        game.setCellState({ x: 1, y: 0 }, CellState.PLAYER_B);
        game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_B);
        expect(game.getWinner()).toBeUndefined();
        game.setCellState({ x: 1, y: 2 }, CellState.PLAYER_B);
        expect(game.getWinner()).toEqual({
            positions: [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
            player: playerB,
        });
        game.reset();

        // Diagonal
        game.setCellState({ x: 0, y: 0 }, CellState.PLAYER_B);
        expect(game.getWinner()).toBeUndefined();
        game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_B);
        game.setCellState({ x: 2, y: 2 }, CellState.PLAYER_B);
        expect(game.getWinner()).toEqual({
            positions: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ],
            player: playerB,
        });
        game.reset();

        game.setCellState({ x: 2, y: 0 }, CellState.PLAYER_A);
        game.setCellState({ x: 1, y: 1 }, CellState.PLAYER_A);
        expect(game.getWinner()).toBeUndefined();
        game.setCellState({ x: 0, y: 2 }, CellState.PLAYER_A);
        expect(game.getWinner()).toEqual({
            positions: [
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 2 },
            ],
            player: playerA,
        });
        game.reset();
    });

    it('should the game behave correctly in simulation', () => {
        playerA.isAI = true;
        playerB.isAI = true;
        const game = new Game(playerA, playerB);
        while (!isFull(game.cells) && game.getWinner() === undefined) {
            game.move();
        }
        console.log(game.getWinner());
    });
});

describe('Other exported', () => {
    it('should nextRandomEmptyPosition() return a random empty position', () => {
        const cells = [
            CellState.PLAYER_B,
            CellState.PLAYER_A,
            CellState.EMPTY,
            CellState.PLAYER_B,
            CellState.PLAYER_A,
            CellState.PLAYER_B,
            CellState.PLAYER_A,
            CellState.EMPTY,
            CellState.EMPTY,
        ];
        const size = cells.length ** 0.5;
        const pos = nextRandomEmptyPosition(cells);
        expect(pos).toBeDefined();
        const index = (pos as Position).y * size + (pos as Position).x;
        expect(cells[index]).toBe(CellState.EMPTY);
    });

    it('should generateWinningPositions() return all possible winning conditions', () => {
        const positions = generateWinningPositions(3);
        expect(positions).toEqual([
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
            ],
            [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: 2 },
            ],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
            [
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
            ],
            [
                { x: 2, y: 0 },
                { x: 2, y: 1 },
                { x: 2, y: 2 },
            ],
            [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 2 },
            ],
            [
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 2 },
            ],
        ]);
    });
});

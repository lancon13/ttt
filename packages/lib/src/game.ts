import { CellState, GameState, Player, Position } from './types';

export class Game {
    _cells: CellState[];
    _size: number;
    _playerA: Player;
    _playerB: Player;
    _current: CellState;
    _winningPositions: Position[][]

    constructor(playerA: Player, playerB: Player, size = 3, current = CellState.PLAYER_A) {
        this._size = size;
        this._cells = Array(this._size ** 2).fill(CellState.EMPTY);
        this._winningPositions = generateWinningPositions(this._size)

        this._playerA = playerA;
        this._playerB = playerB;
        this._current = current;
    }
    get cells(): CellState[] {
        return [...this._cells];
    }
    get size(): number {
        return this._size;
    }
    get playerA(): Player {
        return this._playerA;
    }
    get playerB(): Player {
        return this._playerB;
    }
    get current(): CellState {
        return this._current;
    }

    getWinner(): { positions: Position[]; player: Player } | undefined {
        const winnerACheck = (v: CellState) => v === CellState.PLAYER_A;
        const winnerBCheck = (v: CellState) => v === CellState.PLAYER_B;

        const positionsList = this._winningPositions;
        for (let i = 0; i < positionsList.length; i++) {
            const cells = positionsList[i].map((pos) => this.getCellState(pos));
            if (cells.every(winnerACheck)) return { positions: positionsList[i], player: this._playerA };
            else if (cells.every(winnerBCheck)) return { positions: positionsList[i], player: this._playerB };
        }
        return undefined;
    }

    getGameState(): GameState {
        return {
            playerA: this.playerA,
            playerB: this.playerB,
            cells: this.cells,
        };
    }
    getCellState(pos: Position): CellState {
        return this._cells[pos.y * this._size + pos.x] ?? CellState.EMPTY;
    }
    setCellState(pos: Position, cell: CellState): boolean {
        if (this.isCellEmpty(pos)) {
            this._cells[pos.y * this._size + pos.x] = cell;
            return true;
        }
        return false;
    }
    isCellEmpty(pos: Position): boolean {
        return this._cells[pos.y * this._size + pos.x] == CellState.EMPTY;
    }

    reset(size = 3): void {
        this._size = size;
        this._cells = Array(this._size ** 2).fill(CellState.EMPTY);
        this._winningPositions = generateWinningPositions(this._size)
    }

    move(pos?: Position): boolean {
        let status = false;
        const player = this._current === CellState.PLAYER_A ? this._playerA : this._playerB;
        if (player.isAI) {
            // AI
            pos = nextRandomEmptyPosition(this._cells);
            if (pos) status = this.setCellState(pos, this._current);
        } else if (pos) {
            // Human and Position provided
            status = this.setCellState(pos, this._current);
        }
        if (status) this._current = this._current === CellState.PLAYER_A ? CellState.PLAYER_B : CellState.PLAYER_A;
        return status;
    }
}

/**
 * Generate a random position on empty cell
 *
 * @param {CellState[]} cells
 * @returns {(Position | undefined)}
 */
export const nextRandomEmptyPosition = (cells: CellState[]): Position | undefined => {
    // Check if all cells are occupied
    if (isFull(cells)) return undefined; // No empty cell

    const len = cells.length;
    const size = len ** 0.5;

    let pos: Position | undefined;
    while (!pos) {
        const index = Math.floor(Math.random() * len);
        if (cells[index] === CellState.EMPTY) {
            pos = { x: index % size, y: Math.floor(index / size) };
        }
    }
    return pos;
};

/**
 * Check if all provided cells are filled
 *
 * @param {CellState[]} cells
 * @returns {boolean}
 */
export const isFull = (cells: CellState[]): boolean => {
    return !!cells.find((cell: CellState) => cell === CellState.EMPTY);
};

/**
 * Generate all possible winning positions based on the grid size
 *
 * @param {number} size
 * @returns {Position[][]}
 */
export const generateWinningPositions = (size: number): Position[][] => {
    const positions: Position[][] = [];

    // Horizontal / Vertical
    for (let i = 0; i < size; i++) {
        positions.push(
            Array(size)
                .fill(0)
                .map((_, j) => {
                    return { x: j, y: i };
                })
        );
        positions.push(
            Array(size)
                .fill(0)
                .map((_, j) => {
                    return { x: i, y: j };
                })
        );
    }
    positions.push(
        Array(size)
            .fill(0)
            .map((_, j) => {
                return { x: j, y: j };
            })
    );
    positions.push(
        Array(size)
            .fill(0)
            .map((_, j) => {
                return { x: size - j - 1, y: j };
            })
    );

    return positions;
};

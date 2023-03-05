import { CellState, GameState, Position, User } from './types';

export interface GameOptions {
    size?: number;
    numInRow?: number;
    turn?: CellState.PLAYER | CellState.OPPONENT;
}

export class Game {
    _cells: CellState[];
    _player: User | undefined;
    _opponent: User | undefined;
    _turn: CellState.PLAYER | CellState.OPPONENT;
    _numInRow: number;

    constructor(options?: GameOptions) {
        options ??= {};
        options.size ??= 3;
        options.numInRow ??= options.size;
        options.turn ??= CellState.PLAYER;

        const { size, numInRow, turn } = options;
        const _size = size > 1 && size % 1 === 0 ? size : 3;
        this._cells = Array(_size ** 2).fill(CellState.EMPTY);
        this._player = undefined;
        this._opponent = undefined;
        this._turn = turn;
        this._numInRow = numInRow <= _size ? numInRow : _size;
    }
    get cells(): CellState[] {
        return [...this._cells];
    }
    get size(): number {
        return this._cells.length ** 0.5;
    }
    get numInRow(): number {
        return this._numInRow;
    }
    get turn(): CellState.PLAYER | CellState.OPPONENT {
        return this._turn;
    }
    set turn(turn: CellState.PLAYER | CellState.OPPONENT) {
        this._turn = turn
    }
    get player(): User | undefined {
        return this._player;
    }
    get opponent(): User | undefined {
        return this._opponent;
    }
    set player(player: User | undefined) {
        this._player = player;
    }
    set opponent(opponent: User | undefined) {
        this._opponent = opponent;
    }

    clear(turn?: CellState.PLAYER | CellState.OPPONENT): void {
        this._cells = Array(this.size).fill(CellState.EMPTY);
        this._turn = turn ?? this._turn;
    }
    getAt(pos: Position): CellState {
        return this._cells[pos.y * this.size + pos.x] ?? CellState.EMPTY;
    }
    setAt(pos: Position, cellState: CellState): void {
        this._cells[pos.y * this.size + pos.x] = cellState;
    }
    export(): GameState {
        return {
            cells: this.cells,
            player: this._player,
            opponent: this._opponent,
            turn: this._turn,
            numInRow: this.numInRow,
        };
    }
    import(gameState: GameState): void {
        const size = gameState.cells.length ** 0.5;
        if (size > 1 && size % 1 === 0) {
            this._cells = [...gameState.cells];
            this._player = gameState.player ? { ...gameState.player } : undefined;
            this._opponent = gameState.opponent ? { ...gameState.opponent } : undefined;
            this._turn = gameState.turn;
            this._numInRow = gameState.numInRow
        }
    }    
}

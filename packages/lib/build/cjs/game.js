"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const types_1 = require("./types");
class Game {
    _cells;
    _player;
    _opponent;
    _turn;
    _numInRow;
    constructor(options) {
        options ??= {};
        options.size ??= 3;
        options.numInRow ??= options.size;
        options.turn ??= types_1.CellState.PLAYER;
        const { size, numInRow, turn } = options;
        const _size = size > 1 && size % 1 === 0 ? size : 3;
        this._cells = Array(_size ** 2).fill(types_1.CellState.EMPTY);
        this._player = undefined;
        this._opponent = undefined;
        this._turn = turn;
        this._numInRow = numInRow <= _size ? numInRow : _size;
    }
    get cells() {
        return [...this._cells];
    }
    get size() {
        return this._cells.length ** 0.5;
    }
    get numInRow() {
        return this._numInRow;
    }
    get turn() {
        return this._turn;
    }
    set turn(turn) {
        this._turn = turn;
    }
    get player() {
        return this._player;
    }
    get opponent() {
        return this._opponent;
    }
    set player(player) {
        this._player = player;
    }
    set opponent(opponent) {
        this._opponent = opponent;
    }
    clear(turn) {
        this._cells = Array(this.size).fill(types_1.CellState.EMPTY);
        this._turn = turn ?? this._turn;
    }
    getAt(pos) {
        return this._cells[pos.y * this.size + pos.x] ?? types_1.CellState.EMPTY;
    }
    setAt(pos, cellState) {
        this._cells[pos.y * this.size + pos.x] = cellState;
    }
    export() {
        return {
            cells: this.cells,
            player: this._player,
            opponent: this._opponent,
            turn: this._turn,
            numInRow: this.numInRow,
        };
    }
    import(gameState) {
        const size = gameState.cells.length ** 0.5;
        if (size > 1 && size % 1 === 0) {
            this._cells = [...gameState.cells];
            this._player = gameState.player
                ? { ...gameState.player }
                : undefined;
            this._opponent = gameState.opponent
                ? { ...gameState.opponent }
                : undefined;
            this._turn = gameState.turn;
            this._numInRow = gameState.numInRow;
        }
    }
}
exports.Game = Game;

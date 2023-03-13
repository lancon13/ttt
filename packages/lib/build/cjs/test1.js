"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const helpers_1 = require("./helpers");
const types_1 = require("./types");
const game = new game_1.Game();
const cells = [
    types_1.CellState.PLAYER,
    types_1.CellState.EMPTY,
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.EMPTY,
    types_1.CellState.EMPTY,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.EMPTY,
    types_1.CellState.EMPTY,
    types_1.CellState.EMPTY,
    types_1.CellState.EMPTY,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.EMPTY,
    types_1.CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
    // CellState.EMPTY,
];
const move = (0, helpers_1.getNextMove)({
    index: -1,
    cells,
    size: 4,
    numInRow: 3,
    isMax: true,
});
console.log(move);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const types_1 = require("./types");
const cells = [
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.OPPONENT,
    types_1.CellState.OPPONENT,
    types_1.CellState.PLAYER,
    types_1.CellState.PLAYER,
];
// console.log(listWinningCellIndexesCombinations(4, 3))
console.log((0, helpers_1.findWinningIndexesCombination)(types_1.CellState.OPPONENT, cells, 4, 3));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextMove = exports.findWinningIndexesCombination = exports.getPosition = exports.getIndex = exports.listEmptyCellIndexes = exports.listWinningCellIndexesCombinations = void 0;
const types_1 = require("./types");
const listWinningCellIndexesCombinations = (size, numInRow) => {
    if (size <= 0 || numInRow <= 0 || numInRow > size)
        return [];
    const stride = size - numInRow;
    const indexes = [];
    const cells = Array(numInRow).fill(0);
    for (let i = 0; i < size; i++)
        for (let k = 0; k <= stride; k++) {
            indexes.push(cells.map((_, v) => (i * size + v) + k));
            indexes.push(cells.map((_, v) => ((v + k) * size + i)));
        }
    for (let i = 0; i < size ** 2; i++) {
        const f = cells.map((_, v) => (v * size + v) + i);
        if (f.reduce((c, v) => {
            if (v < 0 || v >= size ** 2 || (0, exports.getPosition)(size, v).y !== c)
                return -1;
            return c + 1;
        }, (0, exports.getPosition)(size, f[0]).y) !== -1)
            indexes.push(f);
        const g = cells.map((_, v) => i + ((size - 1) * v));
        if (g.reduce((c, v) => {
            if (v < 0 || v >= size ** 2 || (0, exports.getPosition)(size, v).y !== c)
                return -1;
            return c + 1;
        }, (0, exports.getPosition)(size, g[0]).y) !== -1)
            indexes.push(g);
    }
    return indexes;
};
exports.listWinningCellIndexesCombinations = listWinningCellIndexesCombinations;
const listEmptyCellIndexes = (cells) => {
    return cells.reduce((indexes, cell, index) => {
        if (cell === types_1.CellState.EMPTY)
            indexes.push(index);
        return indexes;
    }, []);
};
exports.listEmptyCellIndexes = listEmptyCellIndexes;
const getIndex = (size, pos) => {
    const index = pos.y * size + pos.x;
    return index < size ** 2 ? index : -1;
};
exports.getIndex = getIndex;
const getPosition = (size, index) => {
    if (index < 0 || index >= size ** 2)
        return { x: -1, y: -1 };
    const y = Math.floor(index / size);
    const x = index % size;
    return { x, y };
};
exports.getPosition = getPosition;
const findWinningIndexesCombination = (target, cells, size, numInRow) => {
    return (0, exports.listWinningCellIndexesCombinations)(size, numInRow).find((ix) => {
        return ix.every((i) => cells[i] === target);
    });
};
exports.findWinningIndexesCombination = findWinningIndexesCombination;
const getNextMove = ({ index, cells, size, numInRow, isMax, deep = 0 }) => {
    if ((0, exports.findWinningIndexesCombination)(types_1.CellState.PLAYER, cells, size, numInRow))
        return { score: 1, index };
    else if ((0, exports.findWinningIndexesCombination)(types_1.CellState.OPPONENT, cells, size, numInRow))
        return { score: -1, index };
    const emptyCells = (0, exports.listEmptyCellIndexes)(cells);
    if (emptyCells.length === 0)
        return { score: 0, index };
    const moves = emptyCells.map((cellIndex) => {
        cells[cellIndex] = isMax ? types_1.CellState.PLAYER : types_1.CellState.OPPONENT;
        const move = (0, exports.getNextMove)({
            index: cellIndex,
            cells: [...cells],
            size,
            numInRow,
            isMax: !isMax,
            deep: deep + 1
        });
        cells[cellIndex] = types_1.CellState.EMPTY;
        move.index = cellIndex;
        return move;
    });
    const bestMove = moves.reduce((best, move) => {
        if (isMax ? move.score > best.score : move.score < best.score)
            return move;
        return best;
    }, { score: isMax ? -Infinity : Infinity, index: -1 });
    return bestMove;
};
exports.getNextMove = getNextMove;

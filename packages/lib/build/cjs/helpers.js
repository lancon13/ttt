"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextMove = exports.renderCells = exports.findWinningIndexesCombination = exports.getPosition = exports.getIndex = exports.listEmptyCellIndexes = exports.listWinningCellIndexesCombinations = void 0;
const types_1 = require("./types");
const listWinningCellIndexesCombinations = (size, numInRow) => {
    if (size <= 0 || numInRow <= 0 || numInRow > size)
        return [];
    const stride = size - numInRow;
    const indexes = [];
    const cells = Array(size).fill(0);
    const ls = cells.map((_, i) => i * size + i);
    const rs = cells.map((_, i) => (size - i - 1) * size + i);
    const hs = [];
    const vs = [];
    for (let i = 0; i < size; i++) {
        hs.push(cells.map((_, j) => i * size + j));
        vs.push(cells.map((_, j) => j * size + i));
    }
    for (let i = 0; i <= stride; i++) {
        indexes.push(ls.slice(i, i + numInRow));
        indexes.push(rs.slice(i, i + numInRow));
        hs.forEach((h) => indexes.push(h.slice(i, i + numInRow)));
        vs.forEach((v) => indexes.push(v.slice(i, i + numInRow)));
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
const renderCells = (cells, size) => {
    return Array(size).fill('').map((_v, index) => {
        return cells.slice(index * size, (index + 1) * size);
    }).join('\n');
};
exports.renderCells = renderCells;
const getNextMove = ({ index, cells, size, numInRow, isMax, deep = 0 }) => {
    if ((0, exports.findWinningIndexesCombination)(types_1.CellState.PLAYER, cells, size, numInRow))
        return { score: 1, index };
    else if ((0, exports.findWinningIndexesCombination)(types_1.CellState.OPPONENT, cells, size, numInRow))
        return { score: -1, index };
    const emptyCells = (0, exports.listEmptyCellIndexes)(cells);
    if (emptyCells.length === 0)
        return { score: 0, index };
    if (deep >= size)
        return { score: 0, index: emptyCells[Math.floor(Math.random() * emptyCells.length)] };
    const clonedCells = [...cells];
    const moves = emptyCells.map((cellIndex) => {
        clonedCells[cellIndex] = isMax ? types_1.CellState.OPPONENT : types_1.CellState.PLAYER;
        const move = (0, exports.getNextMove)({
            index: cellIndex,
            cells: clonedCells,
            size,
            numInRow,
            isMax: !isMax,
            deep: deep + 1
        });
        clonedCells[cellIndex] = types_1.CellState.EMPTY;
        return move;
    });
    const move = moves.reduce((best, move) => {
        if (isMax ? move.score > best.score : move.score < best.score)
            return move;
        return best;
    }, { score: isMax ? -Infinity : Infinity, index: -1 });
    return move;
};
exports.getNextMove = getNextMove;

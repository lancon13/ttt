import { CellState } from './types';
export const listWinningCellIndexesCombinations = (size, numInRow) => {
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
            if (v < 0 || v >= size ** 2 || getPosition(size, v).y !== c)
                return -1;
            return c + 1;
        }, getPosition(size, f[0]).y) !== -1)
            indexes.push(f);
        const g = cells.map((_, v) => i + ((size - 1) * v));
        if (g.reduce((c, v) => {
            if (v < 0 || v >= size ** 2 || getPosition(size, v).y !== c)
                return -1;
            return c + 1;
        }, getPosition(size, g[0]).y) !== -1)
            indexes.push(g);
    }
    return indexes;
};
export const listEmptyCellIndexes = (cells) => {
    return cells.reduce((indexes, cell, index) => {
        if (cell === CellState.EMPTY)
            indexes.push(index);
        return indexes;
    }, []);
};
export const getIndex = (size, pos) => {
    const index = pos.y * size + pos.x;
    return index < size ** 2 ? index : -1;
};
export const getPosition = (size, index) => {
    if (index < 0 || index >= size ** 2)
        return { x: -1, y: -1 };
    const y = Math.floor(index / size);
    const x = index % size;
    return { x, y };
};
export const findWinningIndexesCombination = (target, cells, size, numInRow) => {
    return listWinningCellIndexesCombinations(size, numInRow).find((ix) => {
        return ix.every((i) => cells[i] === target);
    });
};
export const getNextMove = ({ index, cells, size, numInRow, isMax, deep = 0 }) => {
    if (findWinningIndexesCombination(CellState.PLAYER, cells, size, numInRow))
        return { score: 1, index };
    else if (findWinningIndexesCombination(CellState.OPPONENT, cells, size, numInRow))
        return { score: -1, index };
    const emptyCells = listEmptyCellIndexes(cells);
    if (emptyCells.length === 0)
        return { score: 0, index };
    const moves = emptyCells.map((cellIndex) => {
        cells[cellIndex] = isMax ? CellState.PLAYER : CellState.OPPONENT;
        const move = getNextMove({
            index: cellIndex,
            cells: [...cells],
            size,
            numInRow,
            isMax: !isMax,
            deep: deep + 1
        });
        cells[cellIndex] = CellState.EMPTY;
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

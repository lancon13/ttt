import { CellState } from './types';
export const listWinningCellIndexesCombinations = (size, numInRow) => {
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
export const renderCells = (cells, size) => {
    return Array(size).fill('').map((_v, index) => {
        return cells.slice(index * size, (index + 1) * size);
    }).join('\n');
};
export const getNextMove = ({ index, cells, size, numInRow, isMax, deep = 0 }) => {
    if (findWinningIndexesCombination(CellState.PLAYER, cells, size, numInRow))
        return { score: 1, index };
    else if (findWinningIndexesCombination(CellState.OPPONENT, cells, size, numInRow))
        return { score: -1, index };
    const emptyCells = listEmptyCellIndexes(cells);
    if (emptyCells.length === 0)
        return { score: 0, index };
    if (deep >= size)
        return { score: 0, index: emptyCells[Math.floor(Math.random() * emptyCells.length)] };
    const clonedCells = [...cells];
    const moves = emptyCells.map((cellIndex) => {
        clonedCells[cellIndex] = isMax ? CellState.OPPONENT : CellState.PLAYER;
        const move = getNextMove({
            index: cellIndex,
            cells: clonedCells,
            size,
            numInRow,
            isMax: !isMax,
            deep: deep + 1
        });
        clonedCells[cellIndex] = CellState.EMPTY;
        return move;
    });
    const move = moves.reduce((best, move) => {
        if (isMax ? move.score > best.score : move.score < best.score)
            return move;
        return best;
    }, { score: isMax ? -Infinity : Infinity, index: -1 });
    return move;
};

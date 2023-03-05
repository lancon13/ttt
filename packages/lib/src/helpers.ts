import { CellState, Position } from './types';

export const listWinningCellIndexesCombinations = (size: number, numInRow: number): number[][] => {
    if (size <= 0 || numInRow <= 0 || numInRow > size) return [];

    const stride = size - numInRow;
    const indexes: number[][] = [];
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

export const listEmptyCellIndexes = (cells: CellState[]): number[] => {
    return cells.reduce((indexes, cell, index) => {
        if (cell === CellState.EMPTY) indexes.push(index);
        return indexes;
    }, [] as number[]);
};

export const getIndex = (size: number, pos: Position): number => {
    const index = pos.y * size + pos.x;
    return index < size ** 2 ? index : -1;
};
export const getPosition = (size: number, index: number): Position => {
    if (index < 0 || index >= size ** 2) return { x: -1, y: -1 };
    const y = Math.floor(index / size);
    const x = index % size;
    return { x, y };
};

export const findWinningIndexesCombination = (
    target: CellState.PLAYER | CellState.OPPONENT,
    cells: CellState[],
    size: number,
    numInRow: number
): number[] | undefined => {
    return listWinningCellIndexesCombinations(size, numInRow).find((ix: number[]) => {
        return ix.every((i) => cells[i] === target);
    });
};

export const getNextMove = ({
    index,
    cells,
    size,
    numInRow,
    isMax,
}: {
    index: number;
    cells: CellState[];
    size: number;
    numInRow: number;
    isMax: boolean;
}): { score: number; index: number } => {
    if (!!findWinningIndexesCombination(CellState.PLAYER, cells, size, numInRow)) return { score: 1, index };
    else if (!!findWinningIndexesCombination(CellState.OPPONENT, cells, size, numInRow)) return { score: -1, index };

    const emptyCells = listEmptyCellIndexes(cells);
    if (emptyCells.length === 0) return { score: 0, index };

    const clonedCells = [...cells];
    const moves = emptyCells.map((cellIndex) => {
        clonedCells[cellIndex] = isMax ? CellState.OPPONENT : CellState.PLAYER;
        const move = getNextMove({ index: cellIndex, cells: clonedCells, size, numInRow, isMax: !isMax });
        clonedCells[cellIndex] = CellState.EMPTY;
        return move;
    });

    return moves.reduce(
        (best, move) => {
            if (isMax ? move.score > best.score : move.score < best.score) return move;
            return best;
        },
        { score: isMax ? -Infinity : Infinity, index: -1 }
    );
};
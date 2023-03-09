import { CellState, Position } from './types';
export declare const listWinningCellIndexesCombinations: (size: number, numInRow: number) => number[][];
export declare const listEmptyCellIndexes: (cells: CellState[]) => number[];
export declare const getIndex: (size: number, pos: Position) => number;
export declare const getPosition: (size: number, index: number) => Position;
export declare const findWinningIndexesCombination: (target: CellState.PLAYER | CellState.OPPONENT, cells: CellState[], size: number, numInRow: number) => number[] | undefined;
export declare const renderCells: (cells: CellState[], size: number) => string;
export declare const getNextMove: ({ index, cells, size, numInRow, isMax, deep }: {
    index: number;
    cells: CellState[];
    size: number;
    numInRow: number;
    isMax: boolean;
    deep?: number | undefined;
}) => {
    score: number;
    index: number;
};

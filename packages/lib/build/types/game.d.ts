import { CellState, GameState, Position, User } from './types';
export interface GameOptions {
    size?: number;
    numInRow?: number;
    turn?: CellState.PLAYER | CellState.OPPONENT;
}
export declare class Game {
    _cells: CellState[];
    _player: User | undefined;
    _opponent: User | undefined;
    _turn: CellState.PLAYER | CellState.OPPONENT;
    _numInRow: number;
    constructor(options?: GameOptions);
    get cells(): CellState[];
    get size(): number;
    get numInRow(): number;
    get turn(): CellState.PLAYER | CellState.OPPONENT;
    set turn(turn: CellState.PLAYER | CellState.OPPONENT);
    get player(): User | undefined;
    get opponent(): User | undefined;
    set player(player: User | undefined);
    set opponent(opponent: User | undefined);
    clear(turn?: CellState.PLAYER | CellState.OPPONENT): void;
    getAt(pos: Position): CellState;
    setAt(pos: Position, cellState: CellState): void;
    export(): GameState;
    import(gameState: GameState): void;
}

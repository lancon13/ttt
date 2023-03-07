export var CellState;
(function (CellState) {
    CellState[CellState["EMPTY"] = 0] = "EMPTY";
    CellState[CellState["PLAYER"] = 1] = "PLAYER";
    CellState[CellState["OPPONENT"] = 2] = "OPPONENT";
})(CellState || (CellState = {}));

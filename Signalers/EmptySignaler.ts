import { ICell } from "../Interfaces/ICell";
import { ISignaler } from "../Interfaces/ISignaler";

export class EmptySignaler implements ISignaler {
    private _cells: Array<Array<ICell>> = [];
    private _rows: number = 0;
    private _columns: number = 0;

    public SetCells(cells: Array<Array<ICell>>): void {
        if (cells.length === 0 || cells[0].length === 0) return;
        this._cells = cells;
        this._rows = cells.length;
        this._columns = cells[0].length;
    }

    public Signal(cell: ICell): void {
        const postion = cell.Position;

        for (let r = postion[0] - 1; r <= postion[0] + 1; r++) {
            for (let c = postion[1] - 1; c <= postion[1] + 1; c++) {
                if (r < 0 || r >= this._rows || c < 0 || c >= this._columns) continue;
                this._cells[r][c].EmptySignal();
            }
        }
    }
}
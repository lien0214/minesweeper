import { CellType } from '../Enums/CellType';
import { ICell } from '..//Interfaces/ICell';
import { IBoard } from '../Interfaces/IBoard';

export class NormalCell implements ICell
{
    _signaler: IBoard;
    _revealed = false;
    _flagged = false;
    _cellType = CellType.Number;
    _bombs: number;
    public get CellType(): CellType { return this._cellType; }
    public get Revealed(): boolean { return this._revealed; }
    public get Flagged(): boolean { return this._flagged; }

    public constructor(signaler: IBoard, bombs: number) {
        this._signaler = signaler;
        this._bombs = bombs;
    }

    public Clicked(): void {
        if (this._revealed) return;
        this._revealed = true;
        if (this._bombs > 0) return;
        this._signaler.SignalEmpty(this);
    }

    public PlaceFlag(): void {
        if (this._revealed) return;
        this._flagged = !this._flagged;
    }

    public BombSignal(): void
    {
        // do nothing
    }

    public EmptySignal(): void
    {
        if (this._revealed) return;
        this._revealed = true;
        if (this._bombs === 0) {
            this._signaler.SignalEmpty(this);
        }
    }


    public ToString(): string
    {
        if (this.Revealed) return (this._bombs > 0) ? this._bombs.toString() : " ";
        if (this.Flagged) return "F";
        return "□";
    }
}